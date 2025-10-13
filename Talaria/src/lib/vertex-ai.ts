/**
 * Vertex AI Integration Module
 * Handles communication with Google Cloud Vertex AI for model inference
 */

export interface VertexAIConfig {
  projectId: string;
  location: string;
  endpointId: string;
  apiEndpoint?: string;
}

export interface LSTMInputData {
  instances: number[][][]; // Shape: [batch_size, sequence_length, num_features]
}

export interface VertexAIPrediction {
  predictions: number[][];
  deployedModelId?: string;
  model?: string;
  modelDisplayName?: string;
  modelVersionId?: string;
}

export interface PredictionResult {
  predictions: number[][];
  confidence: number;
  predictedClass: number;
  rawResponse: VertexAIPrediction;
}

/**
 * Format sensor data for LSTM model input
 * Expected input shape: [batch_size, 50, 15]
 * 
 * @param samples - Array of sensor readings (50 samples with 15 features each)
 * @returns Formatted data ready for Vertex AI
 */
export function formatLSTMInput(samples: number[][]): LSTMInputData {
  // Validate input
  if (!Array.isArray(samples)) {
    throw new Error('Input must be an array of samples');
  }
  
  if (samples.length !== 50) {
    throw new Error(`Expected 50 samples, got ${samples.length}`);
  }
  
  // Validate each sample has 15 features
  for (let i = 0; i < samples.length; i++) {
    if (!Array.isArray(samples[i]) || samples[i].length !== 15) {
      throw new Error(`Sample ${i} must have exactly 15 features, got ${samples[i]?.length || 0}`);
    }
  }
  
  // Format as instances array with batch dimension
  return {
    instances: [samples] // Wrap in batch dimension [1, 50, 15]
  };
}

/**
 * Call Vertex AI endpoint for prediction
 * This should be called from a Next.js API route to keep credentials secure
 * 
 * @param config - Vertex AI configuration
 * @param inputData - Formatted LSTM input data
 * @param accessToken - Google Cloud access token
 * @returns Prediction results
 */
export async function callVertexAI(
  config: VertexAIConfig,
  inputData: LSTMInputData,
  accessToken: string
): Promise<VertexAIPrediction> {
  const { projectId, location, endpointId, apiEndpoint = 'https://aiplatform.googleapis.com' } = config;
  
  const url = `${apiEndpoint}/v1/projects/${projectId}/locations/${location}/endpoints/${endpointId}:predict`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inputData),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Vertex AI API error (${response.status}): ${errorText}`);
  }
  
  const result: VertexAIPrediction = await response.json();
  return result;
}

/**
 * Process Vertex AI response to extract prediction results
 * 
 * The LSTM model predicts the next timestep's sensor values (15 features)
 * based on the previous 50 timesteps of data.
 * 
 * @param response - Raw Vertex AI response
 * @returns Processed prediction result
 */
export function processVertexAIResponse(response: VertexAIPrediction): PredictionResult {
  if (!response.predictions || response.predictions.length === 0) {
    throw new Error('No predictions returned from Vertex AI');
  }
  
  // Get the first prediction (batch size is 1)
  // This is a 15-element array representing predicted values for each sensor feature
  const prediction = response.predictions[0];
  
  if (prediction.length !== 15) {
    throw new Error(`Expected 15 predicted values, got ${prediction.length}`);
  }
  
  // For time-series forecasting, we don't have a single "class"
  // Instead, we return the predicted sensor values
  // Calculate average confidence as the inverse of prediction variance
  const mean = prediction.reduce((a, b) => a + b, 0) / prediction.length;
  const variance = prediction.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / prediction.length;
  const confidence = Math.max(0, Math.min(1, 1 - (variance / 100))); // Normalize to [0, 1]
  
  return {
    predictions: response.predictions,
    confidence,
    predictedClass: 0, // Not applicable for time-series forecasting
    rawResponse: response
  };
}

/**
 * Feature names for the LSTM model (in exact training order)
 */
export const LSTM_FEATURES = [
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
] as const;

export const SAMPLES_REQUIRED = 50;

/**
 * Validate if data from Firebase matches expected format
 */
export function validateSensorData(data: any): data is number[][] {
  if (!Array.isArray(data)) return false;
  if (data.length !== SAMPLES_REQUIRED) return false;
  
  return data.every(sample => 
    Array.isArray(sample) && 
    sample.length === LSTM_FEATURES.length &&
    sample.every(val => typeof val === 'number' && !isNaN(val))
  );
}

/**
 * Parse input data from various formats (CSV, JSON, Vertex AI JSON)
 */
export function parseInputData(input: string): number[][] {
  // Try JSON first
  try {
    const parsed = JSON.parse(input);
    
    // Check if it's already in the correct format: [[sample1], [sample2], ...]
    if (validateSensorData(parsed)) {
      return parsed;
    }
    
    // Check if it's Vertex AI format: {"instances": [[[sample1], [sample2], ...]]}
    if (parsed.instances && Array.isArray(parsed.instances)) {
      // Vertex AI format has an extra batch dimension
      if (parsed.instances.length > 0 && Array.isArray(parsed.instances[0])) {
        const data = parsed.instances[0]; // Extract first batch
        if (validateSensorData(data)) {
          return data;
        }
      }
    }
    
    // Check if it's wrapped in an array: [[[sample1], [sample2], ...]]
    if (Array.isArray(parsed) && parsed.length === 1 && Array.isArray(parsed[0])) {
      if (validateSensorData(parsed[0])) {
        return parsed[0];
      }
    }
    
    throw new Error(
      `Parsed JSON does not match expected format. Expected:\n` +
      `- Direct format: [[sample1], [sample2], ...]\n` +
      `- Vertex AI format: {"instances": [[[sample1], [sample2], ...]]}\n` +
      `Each sample must have ${LSTM_FEATURES.length} features, and you need ${SAMPLES_REQUIRED} samples total.`
    );
  } catch (jsonError) {
    // If JSON parsing fails, try CSV
    try {
      const lines = input.trim().split('\n').filter(line => line.trim() && !line.startsWith('#'));
      
      // Check if first line is a header (contains non-numeric values)
      let startIndex = 0;
      if (lines.length > 0) {
        const firstLine = lines[0].split(',');
        // If first value is not a number, it's likely a header
        if (isNaN(parseFloat(firstLine[0].trim()))) {
          startIndex = 1; // Skip header row
          console.log('📝 Detected CSV header, skipping first row');
        }
      }
      
      const samples: number[][] = lines.slice(startIndex).map(line => 
        line.split(',').map(val => parseFloat(val.trim()))
      );
      
      console.log(`📊 Parsed ${samples.length} samples from CSV`);
      
      // Store for error message before validation
      const sampleCount = samples.length;
      const featureCount = sampleCount > 0 ? samples[0]?.length || 0 : 0;
      
      if (validateSensorData(samples)) {
        return samples;
      }
      
      // If validation failed, provide helpful error message
      throw new Error(
        `Invalid CSV format. Expected ${SAMPLES_REQUIRED} samples with ${LSTM_FEATURES.length} features each. ` +
        `Got ${sampleCount} samples with ${featureCount} features.`
      );
    } catch (csvError) {
      // Return the most helpful error message
      const jsonMsg = jsonError instanceof Error ? jsonError.message : 'Invalid JSON';
      const csvMsg = csvError instanceof Error ? csvError.message : 'Invalid CSV';
      throw new Error(
        `Failed to parse input data.\n` +
        `JSON parsing: ${jsonMsg}\n` +
        `CSV parsing: ${csvMsg}`
      );
    }
  }
}

/**
 * Generate a sample CSV template for user reference
 */
export function generateInputTemplate(): string {
  const header = `# LSTM Model Input Template
# ${SAMPLES_REQUIRED} samples × ${LSTM_FEATURES.length} features
# Features (in order): ${LSTM_FEATURES.join(', ')}
# Replace 0.0 values with actual sensor readings
#
# Example values:
# HR: 60-180 (bpm)
# SpO2: 90-100 (%)
# AccX/Y/Z: -20 to 20 (m/s²)
# GyroX/Y/Z: -250 to 250 (°/s)
# Angles: -180 to 180 (degrees)

`;
  
  const rows = Array(SAMPLES_REQUIRED).fill(null)
    .map(() => LSTM_FEATURES.map(() => '0.0').join(','))
    .join('\n');
  
  return header + rows;
}
