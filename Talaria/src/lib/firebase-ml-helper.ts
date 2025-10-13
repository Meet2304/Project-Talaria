/**
 * Firebase Data Helper for ML Model Input
 * Converts Firebase sensor readings to LSTM model input format
 */

import { ref, get } from 'firebase/database';
import { database } from './firebase';
import { LSTM_FEATURES, SAMPLES_REQUIRED } from './vertex-ai';

export interface SensorReading {
  // Model input format (uppercase - for individual readings)
  HR?: number;
  SpO2?: number;
  AccX?: number;
  AccY?: number;
  AccZ?: number;
  GyroX?: number;
  GyroY?: number;
  GyroZ?: number;
  Aroll?: number;
  Apitch?: number;
  Groll?: number;
  Gpitch?: number;
  Gy?: number;
  Combroll?: number;
  Combpitch?: number;
  
  // Firebase batch format (lowercase - arrays of n samples)
  hr?: number[];
  spo2?: number[];
  accX?: number[];
  accY?: number[];
  accZ?: number[];
  gyroX?: number[];
  gyroY?: number[];
  gyroZ?: number[];
  aroll?: number[];
  apitch?: number[];
  groll?: number[];
  gpitch?: number[];
  gyaw?: number[];
  combroll?: number[];
  combpitch?: number[];
  
  // Metadata
  timestamp?: number;
  ts?: number;
  device_id?: string;
  n?: number;
  sample_rate_ms?: number;
}

/**
 * Fetch latest sensor readings from Firebase
 * 
 * @param deviceId - The device ID to fetch data from
 * @param count - Number of samples to fetch (default: 50)
 * @returns Array of sensor readings
 */
export async function fetchLatestReadings(
  deviceId: string, 
  count: number = SAMPLES_REQUIRED
): Promise<SensorReading[]> {
  try {
    // Try both possible database structures
    let readingsRef = ref(database, `devices/${deviceId}/readings`);
    let snapshot = await get(readingsRef);
    
    if (!snapshot.exists()) {
      // Try direct device structure
      readingsRef = ref(database, `${deviceId}/readings`);
      snapshot = await get(readingsRef);
    }
    
    if (!snapshot.exists()) {
      throw new Error(`No readings found for device: ${deviceId}`);
    }
    
    // Get all readings and sort manually
    const readings: SensorReading[] = [];
    snapshot.forEach((childSnapshot) => {
      readings.push(childSnapshot.val());
    });
    
    // Sort by timestamp (descending) and take last N samples
    readings.sort((a, b) => {
      const tsA = a.timestamp || a.ts || 0;
      const tsB = b.timestamp || b.ts || 0;
      return tsB - tsA; // Descending order (newest first)
    });
    
    // Return the requested count
    return readings.slice(0, count);
  } catch (error) {
    console.error('Error fetching readings from Firebase:', error);
    
    // Check if it's an index warning
    if (error instanceof Error && error.message.includes('indexOn')) {
      throw new Error(
        'Firebase Database indexing required. Please add the following to your Firebase Realtime Database Rules:\n\n' +
        '"devices": {\n' +
        '  "$userId": {\n' +
        '    "readings": {\n' +
        '      ".indexOn": ["timestamp", "ts"]\n' +
        '    }\n' +
        '  }\n' +
        '}\n\n' +
        'See FIREBASE_INDEXING_SETUP.md for detailed instructions.'
      );
    }
    
    throw error;
  }
}

/**
 * Get list of available devices from Firebase
 */
export async function getAvailableDevices(): Promise<string[]> {
  try {
    // Try 'devices' parent key first
    let devicesRef = ref(database, 'devices');
    let snapshot = await get(devicesRef);
    
    if (snapshot.exists()) {
      return Object.keys(snapshot.val());
    }
    
    // Try root level
    const rootRef = ref(database, '/');
    snapshot = await get(rootRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const deviceIds = Object.keys(data).filter(key => {
        const item = data[key];
        return item && typeof item === 'object' && item.readings;
      });
      return deviceIds;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching devices from Firebase:', error);
    throw error;
  }
}

/**
 * Convert sensor readings to LSTM model input format
 * Firebase stores data as arrays (batch format), need to transpose to individual samples
 * 
 * @param readings - Array of sensor readings from Firebase (each contains arrays)
 * @returns 2D array formatted for LSTM model [50, 15]
 */
export function convertReadingsToModelInput(readings: SensorReading[]): number[][] {
  // Handle two possible data formats:
  // 1. Single reading with arrays of 50 samples (batch format from ESP32)
  // 2. Multiple individual readings (50 readings with single values)
  
  // Check if we have batch format (single reading with arrays)
  if (readings.length === 1 && readings[0].accX && Array.isArray(readings[0].accX)) {
    return convertBatchFormatToModelInput(readings[0]);
  }
  
  // Check if we have multiple readings but they contain arrays
  if (readings.length > 0 && readings[0].accX && Array.isArray(readings[0].accX)) {
    // Multiple batch readings - flatten them
    return convertMultipleBatchesToModelInput(readings);
  }
  
  // Individual readings format
  if (readings.length < SAMPLES_REQUIRED) {
    throw new Error(`Insufficient data: need ${SAMPLES_REQUIRED} samples, got ${readings.length}`);
  }
  
  // Take the last N samples if we have more than required
  const samples = readings.slice(-SAMPLES_REQUIRED);
  
  // Convert each reading to feature array in the correct order
  return samples.map(reading => {
    const features: number[] = [];
    
    for (const featureName of LSTM_FEATURES) {
      const value = reading[featureName];
      
      if (value === undefined || value === null) {
        throw new Error(`Missing feature: ${featureName} in sensor reading`);
      }
      
      if (typeof value !== 'number' || isNaN(value)) {
        throw new Error(`Invalid value for feature ${featureName}: ${value}`);
      }
      
      features.push(value);
    }
    
    return features;
  });
}

/**
 * Convert batch format (single reading with arrays) to model input
 * Firebase structure: { hr: [50 values], spo2: [50 values], accX: [50 values], ... }
 * Model needs: [[HR, SpO2, AccX, AccY, AccZ, ...], ...] × 50
 */
function convertBatchFormatToModelInput(reading: SensorReading): number[][] {
  // Map model feature names (uppercase) to Firebase field names (lowercase)
  const fieldMapping: { [key: string]: string } = {
    'HR': 'hr',
    'SpO2': 'spo2',
    'AccX': 'accX',
    'AccY': 'accY',
    'AccZ': 'accZ',
    'GyroX': 'gyroX',
    'GyroY': 'gyroY',
    'GyroZ': 'gyroZ',
    'Aroll': 'aroll',
    'Apitch': 'apitch',
    'Groll': 'groll',
    'Gpitch': 'gpitch',
    'Gy': 'gyaw',
    'Combroll': 'combroll',
    'Combpitch': 'combpitch'
  };
  
  // Check if we have all required arrays
  const missingFields: string[] = [];
  for (const modelFeature of LSTM_FEATURES) {
    const firebaseField = fieldMapping[modelFeature];
    const array = (reading as any)[firebaseField];
    
    if (!array || !Array.isArray(array)) {
      missingFields.push(modelFeature);
    }
  }
  
  if (missingFields.length > 0) {
    throw new Error(
      `Device ${reading.device_id || 'unknown'} is missing required features: ${missingFields.join(', ')}`
    );
  }
  
  // Get the number of samples from the first array
  const firstFieldName = fieldMapping[LSTM_FEATURES[0]];
  const firstArray = (reading as any)[firstFieldName] as number[];
  const sampleCount = firstArray.length;
  
  if (sampleCount < SAMPLES_REQUIRED) {
    throw new Error(
      `Insufficient samples: need ${SAMPLES_REQUIRED}, got ${sampleCount}`
    );
  }
  
  // Take last 50 samples if more are available
  const startIdx = Math.max(0, sampleCount - SAMPLES_REQUIRED);
  const endIdx = sampleCount;
  
  // Transpose: from {hr: [50], spo2: [50], ...} to [[hr0, spo20, ...], [hr1, spo21, ...], ...]
  const result: number[][] = [];
  
  for (let i = startIdx; i < endIdx; i++) {
    const sample: number[] = [];
    
    for (const modelFeature of LSTM_FEATURES) {
      const firebaseField = fieldMapping[modelFeature];
      const array = (reading as any)[firebaseField] as number[];
      sample.push(array[i]);
    }
    
    result.push(sample);
  }
  
  return result;
}

/**
 * Convert multiple batch readings to model input (take last 50 samples total)
 */
function convertMultipleBatchesToModelInput(readings: SensorReading[]): number[][] {
  // Flatten all batches into individual samples
  const allSamples: number[][] = [];
  
  for (const reading of readings) {
    const batchSamples = convertBatchFormatToModelInput(reading);
    allSamples.push(...batchSamples);
  }
  
  if (allSamples.length < SAMPLES_REQUIRED) {
    throw new Error(
      `Insufficient total samples: need ${SAMPLES_REQUIRED}, got ${allSamples.length}`
    );
  }
  
  // Take last 50 samples
  return allSamples.slice(-SAMPLES_REQUIRED);
}

/**
 * Fetch and prepare data for model inference
 * 
 * @param deviceId - The device ID to fetch data from
 * @returns Formatted data ready for model input
 */
export async function prepareModelInput(deviceId: string): Promise<number[][]> {
  const readings = await fetchLatestReadings(deviceId);
  return convertReadingsToModelInput(readings);
}

/**
 * Validate that a reading has all required fields
 * Supports both individual format (uppercase) and batch format (lowercase arrays)
 */
export function validateReading(reading: any): reading is SensorReading {
  if (!reading || typeof reading !== 'object') return false;
  
  const fieldMapping: { [key: string]: string } = {
    'HR': 'hr',
    'SpO2': 'spo2',
    'AccX': 'accX',
    'AccY': 'accY',
    'AccZ': 'accZ',
    'GyroX': 'gyroX',
    'GyroY': 'gyroY',
    'GyroZ': 'gyroZ',
    'Aroll': 'aroll',
    'Apitch': 'apitch',
    'Groll': 'groll',
    'Gpitch': 'gpitch',
    'Gy': 'gyaw',
    'Combroll': 'combroll',
    'Combpitch': 'combpitch'
  };
  
  for (const feature of LSTM_FEATURES) {
    const uppercaseValue = reading[feature];
    const lowercaseField = fieldMapping[feature];
    const lowercaseValue = reading[lowercaseField];
    
    // Check individual format (single number)
    if (uppercaseValue !== undefined && uppercaseValue !== null) {
      if (typeof uppercaseValue !== 'number' || isNaN(uppercaseValue)) {
        return false;
      }
      continue;
    }
    
    // Check batch format (array of numbers)
    if (lowercaseValue !== undefined && lowercaseValue !== null) {
      if (!Array.isArray(lowercaseValue) || lowercaseValue.length === 0) {
        return false;
      }
      // Validate first element as sample
      if (typeof lowercaseValue[0] !== 'number' || isNaN(lowercaseValue[0])) {
        return false;
      }
      continue;
    }
    
    // Neither format found
    return false;
  }
  
  return true;
}

/**
 * Get statistics about available data for a device
 */
export async function getDeviceDataStats(deviceId: string): Promise<{
  totalReadings: number;
  latestTimestamp: number | null;
  oldestTimestamp: number | null;
  hasRequiredFeatures: boolean;
  missingFeatures: string[];
}> {
  try {
    let readingsRef = ref(database, `devices/${deviceId}/readings`);
    let snapshot = await get(readingsRef);
    
    if (!snapshot.exists()) {
      // Try direct structure
      readingsRef = ref(database, `${deviceId}/readings`);
      snapshot = await get(readingsRef);
      
      if (!snapshot.exists()) {
        return {
          totalReadings: 0,
          latestTimestamp: null,
          oldestTimestamp: null,
          hasRequiredFeatures: false,
          missingFeatures: [...LSTM_FEATURES]
        };
      }
    }
    
    const readings: SensorReading[] = [];
    snapshot.forEach((childSnapshot) => {
      readings.push(childSnapshot.val());
    });
    
    const timestamps = readings
      .map(r => r.timestamp || r.ts)
      .filter(t => t !== undefined) as number[];
    
    // Check which features are present (check for batch format fields)
    const sampleReading = readings[0] || {};
    const fieldMapping: { [key: string]: string } = {
      'HR': 'hr',
      'SpO2': 'spo2',
      'AccX': 'accX',
      'AccY': 'accY',
      'AccZ': 'accZ',
      'GyroX': 'gyroX',
      'GyroY': 'gyroY',
      'GyroZ': 'gyroZ',
      'Aroll': 'aroll',
      'Apitch': 'apitch',
      'Groll': 'groll',
      'Gpitch': 'gpitch',
      'Gy': 'gyaw',
      'Combroll': 'combroll',
      'Combpitch': 'combpitch'
    };
    
    const missingFeatures = LSTM_FEATURES.filter(
      feature => {
        // Check both uppercase (individual format) and lowercase (batch format)
        const lowercaseField = fieldMapping[feature];
        return !(feature in sampleReading) && !((sampleReading as any)[lowercaseField]);
      }
    );
    
    return {
      totalReadings: readings.length,
      latestTimestamp: timestamps.length > 0 ? Math.max(...timestamps) : null,
      oldestTimestamp: timestamps.length > 0 ? Math.min(...timestamps) : null,
      hasRequiredFeatures: missingFeatures.length === 0,
      missingFeatures
    };
  } catch (error) {
    console.error('Error getting device stats:', error);
    throw error;
  }
}

/**
 * Get paginated data ranges for a device
 * Divides all readings into chunks of SAMPLES_REQUIRED size
 */
export async function getDataRanges(deviceId: string): Promise<{
  id: string;
  label: string;
  startTimestamp: number;
  endTimestamp: number;
  sampleCount: number;
  startIndex: number;
  endIndex: number;
}[]> {
  try {
    let readingsRef = ref(database, `devices/${deviceId}/readings`);
    let snapshot = await get(readingsRef);
    
    if (!snapshot.exists()) {
      readingsRef = ref(database, `${deviceId}/readings`);
      snapshot = await get(readingsRef);
    }
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const readings: SensorReading[] = [];
    snapshot.forEach((childSnapshot) => {
      readings.push(childSnapshot.val());
    });
    
    // Sort by timestamp
    readings.sort((a, b) => {
      const tsA = a.timestamp || a.ts || 0;
      const tsB = b.timestamp || b.ts || 0;
      return tsA - tsB; // Ascending order
    });
    
    const ranges = [];
    const chunkSize = SAMPLES_REQUIRED;
    
    for (let i = 0; i < readings.length; i += chunkSize) {
      const chunk = readings.slice(i, Math.min(i + chunkSize, readings.length));
      
      if (chunk.length >= SAMPLES_REQUIRED) {
        const startTs = chunk[0].timestamp || chunk[0].ts || 0;
        const endTs = chunk[chunk.length - 1].timestamp || chunk[chunk.length - 1].ts || 0;
        
        ranges.push({
          id: `range-${i}`,
          label: `Samples ${i + 1}-${i + chunk.length} (${new Date(startTs).toLocaleString()})`,
          startTimestamp: startTs,
          endTimestamp: endTs,
          sampleCount: chunk.length,
          startIndex: i,
          endIndex: i + chunk.length - 1
        });
      }
    }
    
    return ranges.reverse(); // Most recent first
  } catch (error) {
    console.error('Error getting data ranges:', error);
    throw error;
  }
}

/**
 * Fetch specific range of readings
 */
export async function fetchReadingsByRange(
  deviceId: string,
  startIndex: number,
  endIndex: number
): Promise<SensorReading[]> {
  try {
    let readingsRef = ref(database, `devices/${deviceId}/readings`);
    let snapshot = await get(readingsRef);
    
    if (!snapshot.exists()) {
      readingsRef = ref(database, `${deviceId}/readings`);
      snapshot = await get(readingsRef);
    }
    
    if (!snapshot.exists()) {
      throw new Error(`No readings found for device: ${deviceId}`);
    }
    
    const readings: SensorReading[] = [];
    snapshot.forEach((childSnapshot) => {
      readings.push(childSnapshot.val());
    });
    
    // Sort by timestamp
    readings.sort((a, b) => {
      const tsA = a.timestamp || a.ts || 0;
      const tsB = b.timestamp || b.ts || 0;
      return tsA - tsB;
    });
    
    return readings.slice(startIndex, endIndex + 1);
  } catch (error) {
    console.error('Error fetching readings by range:', error);
    throw error;
  }
}
