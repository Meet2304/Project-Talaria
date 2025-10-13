"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Upload, Play, Download, Loader2, CheckCircle2, AlertCircle, Cloud, Database as DatabaseIcon, Calendar, Clock, Info, TrendingUp, Shuffle } from "lucide-react";
import { LSTM_FEATURES, SAMPLES_REQUIRED, generateInputTemplate, parseInputData } from "@/lib/vertex-ai";
import { getAvailableDevices, prepareModelInput, getDeviceDataStats, getDataRanges, fetchReadingsByRange, convertReadingsToModelInput } from "@/lib/firebase-ml-helper";
import Toaster, { ToasterRef } from "@/components/toast";

// Feature descriptions for predicted values
const FEATURE_DESCRIPTIONS: Record<string, string> = {
  "HR": "Heart Rate (beats per minute)",
  "SpO2": "Blood Oxygen Level (%)",
  "AccX": "Acceleration X-axis (m/s²)",
  "AccY": "Acceleration Y-axis (m/s²)",
  "AccZ": "Acceleration Z-axis (m/s²)",
  "GyroX": "Rotation X-axis (°/s)",
  "GyroY": "Rotation Y-axis (°/s)",
  "GyroZ": "Rotation Z-axis (°/s)",
  "Aroll": "Accelerometer Roll (°)",
  "Apitch": "Accelerometer Pitch (°)",
  "Groll": "Gyroscope Roll (°)",
  "Gpitch": "Gyroscope Pitch (°)",
  "Gy": "Gyroscope Yaw (°)",
  "Combroll": "Combined Roll (°)",
  "Combpitch": "Combined Pitch (°)",
};

interface PredictionResult {
  predictedValues: number[]; // 15 predicted sensor values for next timestep
  features: string[]; // Feature names in order
  confidence: number;
  metadata?: {
    modelType?: string;
    description?: string;
  };
}

interface DataRange {
  id: string;
  label: string;
  startTimestamp: number;
  endTimestamp: number;
  sampleCount: number;
  startIndex: number;
  endIndex: number;
}
export function VertexAIInferenceInterface() {
  const [inputData, setInputData] = useState<string>("");
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const [apiStatus, setApiStatus] = useState<'checking' | 'ready' | 'error'>('checking');
  
  // Toast ref
  const toasterRef = useRef<ToasterRef>(null);
  
  // Ref for scrolling to prediction results
  const predictionResultsRef = useRef<HTMLDivElement>(null);
  
  // Firebase data loading
  const [devices, setDevices] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [deviceStats, setDeviceStats] = useState<any>(null);
  const [dataRanges, setDataRanges] = useState<DataRange[]>([]);
  const [selectedRange, setSelectedRange] = useState<string>("");
  const [loadingRanges, setLoadingRanges] = useState(false);

  // Check API configuration on mount
  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    try {
      const response = await fetch('/api/vertex-ai/predict');
      const data = await response.json();
      
      if (data.status === 'ok') {
        setApiStatus('ready');
        toasterRef.current?.show({
          title: "System Ready",
          message: "Vertex AI connection established",
          variant: "success",
          duration: 3000,
        });
      } else {
        setApiStatus('error');
        setError('API configuration incomplete. Check environment variables.');
        toasterRef.current?.show({
          title: "Configuration Error",
          message: "Please check your environment variables",
          variant: "error",
          duration: 5000,
        });
      }
    } catch {
      setApiStatus('error');
      setError('Failed to connect to API endpoint');
      toasterRef.current?.show({
        title: "Connection Failed",
        message: "Unable to reach prediction API",
        variant: "error",
        duration: 5000,
      });
    }
  };

  // Load available devices from Firebase
  const loadDevices = async () => {
    setLoadingDevices(true);
    try {
      const deviceList = await getAvailableDevices();
      setDevices(deviceList);
      
      if (deviceList.length > 0 && !selectedDevice) {
        setSelectedDevice(deviceList[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load devices');
    } finally {
      setLoadingDevices(false);
    }
  };

  // Load device statistics
  const loadDeviceStats = async (deviceId: string) => {
    try {
      const stats = await getDeviceDataStats(deviceId);
      setDeviceStats(stats);
      
      if (!stats.hasRequiredFeatures) {
        setError(`Device ${deviceId} is missing required features: ${stats.missingFeatures.join(', ')}`);
      }
      
      // Also load data ranges for this device
      loadDataRanges(deviceId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load device stats');
    }
  };

  // Load available data ranges for a device
  const loadDataRanges = async (deviceId: string) => {
    setLoadingRanges(true);
    try {
      const ranges = await getDataRanges(deviceId);
      setDataRanges(ranges);
      
      if (ranges.length > 0 && !selectedRange) {
        setSelectedRange(ranges[0].id); // Select most recent by default
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data ranges');
    } finally {
      setLoadingRanges(false);
    }
  };

  // Load data from selected device
  const loadDataFromDevice = async () => {
    if (!selectedDevice) {
      setError('Please select a device');
      return;
    }

    if (!selectedRange) {
      setError('Please select a data batch');
      return;
    }

    setIsProcessing(true);
    setError("");
    
    try {
      const range = dataRanges.find(r => r.id === selectedRange);
      if (!range) {
        setError('Invalid batch selection');
        setIsProcessing(false);
        return;
      }
      
      const readings = await fetchReadingsByRange(
        selectedDevice,
        range.startIndex,
        range.endIndex
      );
      
      const modelInput = convertReadingsToModelInput(readings);
      
      // Convert to CSV format for display
      const csvData = modelInput.map(row => row.join(',')).join('\n');
      setInputData(csvData);
      
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load device data');
    } finally {
      setIsProcessing(false);
    }
  };

  // Run inference using Vertex AI
  const runVertexAIInference = async () => {
    if (!inputData) {
      setError('Please provide input data');
      toasterRef.current?.show({
        title: "Missing Input",
        message: "Please upload or paste sensor data first",
        variant: "warning",
        duration: 4000,
      });
      return;
    }

    setIsProcessing(true);
    setError("");
    setPredictionResult(null);

    // Step 1: Parsing data
    toasterRef.current?.show({
      title: "Step 1: Parsing Data",
      message: "Validating and formatting your input...",
      variant: "default",
      duration: 2000,
    });

    try {
      // Validate and parse input
      const parsedData = parseInputData(inputData);

      // Step 2: Sending to AI
      toasterRef.current?.show({
        title: "Step 2: Sending to AI",
        message: "Connecting to Vertex AI model...",
        variant: "default",
        duration: 2000,
      });

      // Call our API endpoint
      const response = await fetch('/api/vertex-ai/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: parsedData,
          modelType: 'vertex-ai'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Prediction failed');
      }

      const result = await response.json();
      
      if (result.success) {
        // Step 3: Success
        setPredictionResult(result.prediction);
        
        toasterRef.current?.show({
          title: "Prediction Complete",
          message: "Successfully predicted next timestep sensor values",
          variant: "success",
          duration: 5000,
        });
        
        // Scroll to prediction results
        setTimeout(() => {
          predictionResultsRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 300);
      } else {
        throw new Error(result.error || 'Prediction failed');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error running inference';
      setError(errorMessage);
      toasterRef.current?.show({
        title: "Prediction Failed",
        message: errorMessage,
        variant: "error",
        duration: 6000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Download template
  const downloadTemplate = () => {
    const template = generateInputTemplate();
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lstm_input_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate random sample data for testing
  const generateRandomData = () => {
    // Realistic ranges for each sensor feature
    const featureRanges: Record<string, [number, number]> = {
      HR: [60, 180],           // Heart Rate (bpm)
      SpO2: [90, 100],         // Blood Oxygen (%)
      AccX: [-2, 2],           // Acceleration X (m/s²)
      AccY: [-2, 2],           // Acceleration Y (m/s²)
      AccZ: [8, 11],           // Acceleration Z (m/s²) - includes gravity
      GyroX: [-100, 100],      // Gyroscope X (°/s)
      GyroY: [-100, 100],      // Gyroscope Y (°/s)
      GyroZ: [-100, 100],      // Gyroscope Z (°/s)
      Aroll: [-30, 30],        // Accelerometer Roll (°)
      Apitch: [-30, 30],       // Accelerometer Pitch (°)
      Groll: [-30, 30],        // Gyroscope Roll (°)
      Gpitch: [-30, 30],       // Gyroscope Pitch (°)
      Gy: [-30, 30],           // Gyroscope Yaw (°)
      Combroll: [-30, 30],     // Combined Roll (°)
      Combpitch: [-30, 30],    // Combined Pitch (°)
    };

    const randomData: number[][] = [];
    
    // Generate 50 samples
    for (let i = 0; i < SAMPLES_REQUIRED; i++) {
      const sample: number[] = [];
      
      // Generate value for each of the 15 features
      LSTM_FEATURES.forEach(feature => {
        const [min, max] = featureRanges[feature] || [0, 1];
        const randomValue = min + Math.random() * (max - min);
        sample.push(parseFloat(randomValue.toFixed(3)));
      });
      
      randomData.push(sample);
    }

    // Convert to CSV format
    const csvData = randomData.map(row => row.join(',')).join('\n');
    setInputData(csvData);

    toasterRef.current?.show({
      title: "Random Data Generated",
      message: `Generated ${SAMPLES_REQUIRED} samples with realistic sensor values`,
      variant: "success",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <Toaster ref={toasterRef} defaultPosition="top-right" />
      
      {/* Model Information */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Info className="w-5 h-5" />
            LSTM Time-Series Forecasting Model
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                What This Model Does
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                This LSTM neural network analyzes <strong>50 consecutive timesteps</strong> of sensor data and predicts the <strong>next timestep's values</strong> for all 15 sensor features. It's a time-series forecasting model, not a classification model.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">R² Score</div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">96.99%</div>
                <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">Model accuracy</div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-xs text-green-600 dark:text-green-400 mb-1">MAE</div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">0.103</div>
                <div className="text-xs text-green-700 dark:text-green-300 mt-1">Mean Absolute Error</div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">RMSE</div>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">0.174</div>
                <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">Root Mean Square Error</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                How to Use
              </h3>
              <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 flex-shrink-0">1</Badge>
                  <span>Upload or paste <strong>50 samples</strong> of sensor data (CSV or JSON format)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 flex-shrink-0">2</Badge>
                  <span>Each sample must contain all <strong>15 sensor features</strong> (HR, SpO2, AccX, AccY, AccZ, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 flex-shrink-0">3</Badge>
                  <span>Click <strong>"Run Inference"</strong> to predict the next timestep</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 flex-shrink-0">4</Badge>
                  <span>View predicted sensor values for the immediate future</span>
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Required Sensor Features - Compact Version */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <DatabaseIcon className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">Required Sensor Features</CardTitle>
          </div>
          <CardDescription className="text-xs">
            15 features required in exact order: {LSTM_FEATURES.join(', ')}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Mode Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                LSTM Model Inference
              </CardTitle>
              <CardDescription>
                Run predictions on the LSTM model deployed to Google Cloud Vertex AI
              </CardDescription>
            </div>
            <Badge variant={apiStatus === 'ready' ? 'default' : apiStatus === 'error' ? 'destructive' : 'secondary'}>
              {apiStatus === 'checking' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
              {apiStatus === 'checking' && 'Checking...'}
              {apiStatus === 'ready' && <><Cloud className="w-3 h-3 mr-1" />Vertex AI Ready</>}
              {apiStatus === 'error' && <><AlertCircle className="w-3 h-3 mr-1" />Configuration Required</>}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {apiStatus === 'error' && error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
                <br />
                <span className="text-xs mt-2 block">
                  Please configure environment variables: GOOGLE_CLOUD_PROJECT_ID, VERTEX_AI_ENDPOINT_ID
                </span>
              </AlertDescription>
            </Alert>
          )}
          
          {apiStatus === 'ready' && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Connected to Vertex AI endpoint. Ready for inference.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Input Data Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Input Data</CardTitle>
          <CardDescription>
            Provide {SAMPLES_REQUIRED} samples with {LSTM_FEATURES.length} features each
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Input</TabsTrigger>
              <TabsTrigger value="firebase">Load from Firebase</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-data">
                  Paste CSV or JSON data ({SAMPLES_REQUIRED} samples × {LSTM_FEATURES.length} features)
                </Label>
                <textarea
                  id="input-data"
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder={`Enter data in CSV format:\n0.1, 0.2, 0.3, ... (15 values)\n0.2, 0.3, 0.4, ... (15 values)\n... (50 rows total)\n\nOr JSON format:\n[[0.1, 0.2, ...], [0.2, 0.3, ...], ...]`}
                  className="w-full h-48 p-3 border rounded-md font-mono text-sm"
                  disabled={apiStatus !== 'ready'}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={runVertexAIInference}
                  disabled={apiStatus !== 'ready' || !inputData || isProcessing}
                  className="flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run Inference
                    </>
                  )}
                </Button>

                <Button 
                  variant="outline"
                  onClick={generateRandomData}
                  disabled={apiStatus !== 'ready'}
                  className="flex items-center gap-2"
                >
                  <Shuffle className="w-4 h-4" />
                  Generate Random Data
                </Button>

                <Button 
                  variant="outline"
                  onClick={downloadTemplate}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="firebase" className="space-y-4">
              <div className="space-y-4">
                {/* Device Selection */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="device-select" className="text-base font-semibold">Step 1: Select Device</Label>
                    <Select value={selectedDevice} onValueChange={(value) => {
                      setSelectedDevice(value);
                      loadDeviceStats(value);
                      setSelectedRange(""); // Reset range when device changes
                    }}>
                      <SelectTrigger id="device-select" className="mt-2">
                        <SelectValue placeholder="Choose a device to view its data" />
                      </SelectTrigger>
                      <SelectContent>
                        {devices.map(device => (
                          <SelectItem key={device} value={device}>
                            <div className="flex items-center gap-2">
                              <DatabaseIcon className="w-4 h-4" />
                              {device}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={loadDevices}
                    disabled={loadingDevices}
                    variant="outline"
                    className="mt-auto"
                  >
                    {loadingDevices ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Refresh Devices'
                    )}
                  </Button>
                </div>

                {/* Device Statistics */}
                {deviceStats && selectedDevice && (
                  <Alert className={deviceStats.hasRequiredFeatures ? 'border-green-200 bg-green-50 dark:bg-green-950' : 'border-red-200 bg-red-50 dark:bg-red-950'}>
                    <CheckCircle2 className={`h-4 w-4 ${deviceStats.hasRequiredFeatures ? 'text-green-600' : 'text-red-600'}`} />
                    <AlertDescription>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span><strong>Total Readings:</strong> {deviceStats.totalReadings}</span>
                        <span><strong>Available Batches:</strong> {Math.floor(deviceStats.totalReadings / SAMPLES_REQUIRED)}</span>
                        <span><strong>Status:</strong> {deviceStats.hasRequiredFeatures ? '✓ Ready' : '✗ Missing Features'}</span>
                      </div>
                      {deviceStats.missingFeatures.length > 0 && (
                        <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                          ⚠️ Missing: {deviceStats.missingFeatures.join(', ')}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Data Batch Selection */}
                {selectedDevice && dataRanges.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Step 2: Select a Data Batch (50 samples each)</Label>
                    <p className="text-sm text-muted-foreground">
                      Each card represents a batch of 50 consecutive sensor readings. Click to select, then load for inference.
                    </p>
                    
                    {loadingRanges ? (
                      <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Loading available batches...
                      </div>
                    ) : (
                      <div className="h-[400px] overflow-y-auto rounded-md border p-4 bg-slate-50 dark:bg-slate-900">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {dataRanges.map((range, idx) => {
                            const isSelected = selectedRange === range.id;
                            const isValid = range.sampleCount >= SAMPLES_REQUIRED;
                            const startDate = new Date(range.startTimestamp);
                            const endDate = new Date(range.endTimestamp);
                            
                            return (
                              <Card
                                key={range.id}
                                className={`cursor-pointer transition-all ${
                                  !isValid 
                                    ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900' 
                                    : isSelected 
                                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950 border-blue-200' 
                                      : 'hover:border-blue-300 hover:shadow-md'
                                }`}
                                onClick={() => {
                                  if (isValid) {
                                    setSelectedRange(range.id);
                                    setError('');
                                  }
                                }}
                              >
                                <CardHeader className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                                        Batch #{dataRanges.length - idx}
                                        {!isValid && <Badge variant="destructive" className="ml-2">Incomplete</Badge>}
                                      </CardTitle>
                                      <CardDescription className="text-xs mt-1">
                                        Samples {range.startIndex + 1} - {range.endIndex + 1}
                                      </CardDescription>
                                    </div>
                                    <Badge variant={isValid ? "default" : "secondary"} className="text-xs">
                                      {range.sampleCount} samples
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                  <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Calendar className="w-3 h-3" />
                                      <span>{startDate.toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Clock className="w-3 h-3" />
                                      <span>
                                        {startDate.toLocaleTimeString()} - {endDate.toLocaleTimeString()}
                                      </span>
                                    </div>
                                    {!isValid && (
                                      <div className="text-red-600 dark:text-red-400 text-xs mt-2">
                                        ⚠️ Needs {SAMPLES_REQUIRED} samples, only has {range.sampleCount}
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* No Data State */}
                {selectedDevice && !loadingRanges && dataRanges.length === 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No data batches available for this device. Device needs at least {SAMPLES_REQUIRED} consecutive samples to create a batch.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                {selectedDevice && dataRanges.length > 0 && (
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={loadDataFromDevice}
                      disabled={
                        !selectedDevice || 
                        !selectedRange ||
                        isProcessing || 
                        apiStatus !== 'ready'
                      }
                      className="flex-1 flex items-center justify-center gap-2"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading Data...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Load Selected Batch
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={runVertexAIInference}
                      disabled={apiStatus !== 'ready' || !inputData || isProcessing}
                      className="flex-1 flex items-center justify-center gap-2"
                      variant="default"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Run Inference
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {error && apiStatus !== 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Prediction Results */}
      {predictionResult && (
        <div ref={predictionResultsRef}>
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Predicted Next Timestep Values
            </CardTitle>
            <CardDescription>
              LSTM model has forecast the next sensor readings based on your 50-sample sequence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Model Confidence */}
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-sm text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                Prediction Quality
              </div>
              <div className="text-4xl font-bold mb-2">
                {(predictionResult.confidence * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                Based on prediction consistency and variance
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000 rounded-full"
                  style={{ width: `${predictionResult.confidence * 100}%` }}
                />
              </div>
            </div>

            {/* Predicted Sensor Values */}
            <div className="bg-card p-6 rounded-lg border">
              <Label className="text-base font-semibold mb-4 block flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Predicted Sensor Values (Next Timestep)
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                Forecasted values for each of the 15 sensor features at the next time point after your 50-sample input sequence.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {predictionResult.features.map((feature, idx) => {
                  const value = predictionResult.predictedValues[idx];
                  const description = FEATURE_DESCRIPTIONS[feature] || feature;
                  
                  return (
                    <div key={feature} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs font-mono">
                          {feature}
                        </Badge>
                        <span className="text-xl font-bold">
                          {value.toFixed(3)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground" title={description}>
                        {description}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Model Info */}
            {predictionResult.metadata && (
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription className="text-sm">
                  <strong>Model Type:</strong> {predictionResult.metadata.modelType}<br />
                  <strong>Description:</strong> {predictionResult.metadata.description}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        </div>
      )}
    </div>
  );
}
