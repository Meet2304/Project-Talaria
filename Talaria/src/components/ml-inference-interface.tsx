"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Upload, Play, Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import * as tf from '@tensorflow/tfjs';

// Model path in public folder
const MODEL_PATH = "/models/Talaria-LSTM-v2/model.json";

// Feature names for the LSTM model (in the exact order used during training)
const FEATURE_NAMES = [
  "HR",        // Heart Rate (index 0)
  "SpO2",      // SpO2 (index 1)
  "AccX",      // Accelerometer X (index 2)
  "AccY",      // Accelerometer Y (index 3)
  "AccZ",      // Accelerometer Z (index 4)
  "GyroX",     // Gyroscope X (index 5)
  "GyroY",     // Gyroscope Y (index 6)
  "GyroZ",     // Gyroscope Z (index 7)
  "Aroll",     // Accelerometer Roll (index 8)
  "Apitch",    // Accelerometer Pitch (index 9)
  "Groll",     // Gyroscope Roll (index 10)
  "Gpitch",    // Gyroscope Pitch (index 11)
  "Gy",        // Gyroscope Yaw (index 12)
  "Combroll",  // Combined Roll (index 13)
  "Combpitch"  // Combined Pitch (index 14)
];

const SAMPLES_REQUIRED = 50;

interface PredictionResult {
  prediction: number[];
  confidence: number;
  class: string;
}

export function MLInferenceInterface() {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [modelStatus, setModelStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [inputData, setInputData] = useState<string>("");
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");

  // Load model from local public folder
  const loadModel = async () => {
    setModelStatus('loading');
    setError("");
    
    try {
      // Set backend to CPU for better compatibility
      await tf.ready();
      
      // Load the TensorFlow.js model from the public folder
      // The model.json file contains references to the weight files (.bin)
      // TensorFlow.js will automatically load them from the same directory
      const loadedModel = await tf.loadLayersModel(MODEL_PATH, {
        strict: false // Allow loading models with minor incompatibilities
      });
      
      setModel(loadedModel);
      setModelStatus('loaded');
    } catch (err) {
      let errorMessage = 'Failed to load model from local files. ';
      
      if (err instanceof Error) {
        if (err.message.includes('404') || err.message.includes('not found')) {
          errorMessage += `\n\nModel files not found. Please ensure:\n` +
            `1. Copy your TensorFlow.js model files to: public/models/Talaria-LSTM-v2/\n` +
            `2. Required files: model.json and all .bin weight files\n` +
            `3. Restart the development server after adding files`;
        } else if (err.message.includes('InputLayer')) {
          errorMessage += `\n\nModel architecture issue. This may be due to Keras 3.x compatibility.\n` +
            `Try reconverting your model with:\n` +
            `tensorflowjs_converter --input_format=keras --output_format=tfjs_layers_model model.h5 tfjs_output\n\n` +
            `Or use TensorFlow.js 4.x which has better Keras 3 support.\n` +
            `Error: ${err.message}`;
        } else {
          errorMessage += `\n\nError: ${err.message}`;
        }
      }
      
      setError(errorMessage);
      setModelStatus('error');
    }
  };

  // Parse input data from CSV or JSON
  const parseInputData = (data: string): number[][] | null => {
    try {
      // Try parsing as JSON first
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length === SAMPLES_REQUIRED) {
        return parsed;
      }
    } catch {
      // Try parsing as CSV
      const lines = data.trim().split('\n');
      if (lines.length === SAMPLES_REQUIRED) {
        const samples = lines.map(line => 
          line.split(',').map(val => parseFloat(val.trim()))
        );
        
        // Validate all samples have 15 features
        if (samples.every(sample => sample.length === FEATURE_NAMES.length)) {
          return samples;
        }
      }
    }
    return null;
  };

  // Run inference
  const runInference = async () => {
    if (!model) {
      setError("Please load the model first");
      return;
    }

    setIsProcessing(true);
    setError("");
    setPredictionResult(null);

    try {
      const parsedData = parseInputData(inputData);
      
      if (!parsedData) {
        throw new Error(`Invalid input format. Please provide ${SAMPLES_REQUIRED} samples with ${FEATURE_NAMES.length} features each.`);
      }

      // Convert to tensor - shape should be [1, 50, 15]
      const inputTensor = tf.tensor3d([parsedData]);
      
      // Run prediction
      const prediction = model.predict(inputTensor) as tf.Tensor;
      const predictionArray = await prediction.array() as number[][];
      
      // Get the predicted class and confidence
      const predictionValues = predictionArray[0];
      const maxConfidence = Math.max(...predictionValues);
      const predictedClass = predictionValues.indexOf(maxConfidence);
      
      setPredictionResult({
        prediction: predictionValues,
        confidence: maxConfidence,
        class: `Class ${predictedClass}` // You can map this to actual class names
      });

      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error running inference');
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate sample data template
  const generateTemplate = () => {
    const template = Array(SAMPLES_REQUIRED).fill(null).map(() => 
      FEATURE_NAMES.map(() => '0.0').join(',')
    ).join('\n');
    
    // Create a downloadable file
    const blob = new Blob([`# Sample Input Template\n# ${SAMPLES_REQUIRED} samples, ${FEATURE_NAMES.length} features per sample\n# Features: ${FEATURE_NAMES.join(', ')}\n\n${template}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lstm_input_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Load latest sensor data from database
  const loadLatestData = () => {
    // This would fetch the latest 50 samples from your Firebase database
    // For now, show a placeholder message
    setError("Feature coming soon: Load latest sensor data from database");
  };

  return (
    <div className="space-y-6">
      {/* Model Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                LSTM Model
              </CardTitle>
              <CardDescription>
                Load and run inference on the TensorFlow.js model from Firebase Storage
              </CardDescription>
            </div>
            <Badge variant={modelStatus === 'loaded' ? 'default' : 'secondary'}>
              {modelStatus === 'idle' && 'Not Loaded'}
              {modelStatus === 'loading' && 'Loading...'}
              {modelStatus === 'loaded' && 'Ready'}
              {modelStatus === 'error' && 'Error'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={loadModel} 
              disabled={modelStatus === 'loading' || modelStatus === 'loaded'}
              className="flex items-center gap-2"
            >
              {modelStatus === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading Model...
                </>
              ) : modelStatus === 'loaded' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Model Loaded
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Load Model
                </>
              )}
            </Button>
          </div>

          {modelStatus === 'loaded' && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Model loaded successfully! Ready for inference.
              </AlertDescription>
            </Alert>
          )}

          {error && modelStatus === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Input Data Card */}
      <Card>
        <CardHeader>
          <CardTitle>Input Data</CardTitle>
          <CardDescription>
            Provide {SAMPLES_REQUIRED} samples with {FEATURE_NAMES.length} features each
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input-data">
              Paste CSV or JSON data ({SAMPLES_REQUIRED} samples × {FEATURE_NAMES.length} features)
            </Label>
            <textarea
              id="input-data"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder={`Enter data in CSV format:\n0.1, 0.2, 0.3, ... (15 values)\n0.2, 0.3, 0.4, ... (15 values)\n... (50 rows total)\n\nOr JSON format:\n[[0.1, 0.2, ...], [0.2, 0.3, ...], ...]`}
              className="w-full h-48 p-3 border rounded-md font-mono text-sm"
              disabled={modelStatus !== 'loaded'}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={runInference}
              disabled={!model || !inputData || isProcessing}
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
              onClick={generateTemplate}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Template
            </Button>

            <Button 
              variant="outline"
              onClick={loadLatestData}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Load Latest Data
            </Button>
          </div>

          {error && modelStatus !== 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Features Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Required Features</CardTitle>
          <CardDescription>
            Each sample must contain these {FEATURE_NAMES.length} features in order:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {FEATURE_NAMES.map((feature, idx) => (
              <Badge key={idx} variant="outline" className="justify-center">
                {idx + 1}. {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prediction Results */}
      {predictionResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Prediction Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 border-l-4 border-blue-500">
                <div className="text-sm text-slate-500 mb-1">Predicted Class</div>
                <div className="text-2xl font-bold text-slate-900">
                  {predictionResult.class}
                </div>
              </div>
              <div className="bg-slate-50 p-4 border-l-4 border-green-500">
                <div className="text-sm text-slate-500 mb-1">Confidence</div>
                <div className="text-2xl font-bold text-slate-900">
                  {(predictionResult.confidence * 100).toFixed(2)}%
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">All Class Probabilities:</Label>
              <div className="space-y-2">
                {predictionResult.prediction.map((prob, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-sm w-20">Class {idx}:</span>
                    <div className="flex-1 h-6 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${prob * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono w-16 text-right">
                      {(prob * 100).toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
