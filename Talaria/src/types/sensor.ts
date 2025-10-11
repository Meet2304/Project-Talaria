// Sensor data types based on actual Firebase structure
// Each reading contains arrays of n samples (typically 17-50)
export interface SensorReading {
  id: string;
  timestamp: number; // ts field in Firebase
  client_ts_ms: number;
  device_id: string;
  n: number; // number of samples
  sample_rate_ms: number; // sampling rate in milliseconds
  steps_in_batch?: number; // number of steps detected in this batch
  
  // Accelerometer data (arrays of n values)
  accX: number[];
  accY: number[];
  accZ: number[];
  
  // Gyroscope data (arrays of n values)
  gyroX: number[];
  gyroY: number[];
  gyroZ: number[];
  
  // Pitch angles (arrays of n values)
  apitch: number[];  // Accelerometer-based pitch
  gpitch: number[];  // Gyroscope-based pitch
  combpitch: number[]; // Combined pitch
  
  // Roll angles (arrays of n values)
  aroll: number[];   // Accelerometer-based roll
  groll: number[];   // Gyroscope-based roll
  combroll: number[]; // Combined roll
  
  // Yaw (arrays of n values)
  gyaw: number[];
  
  // Heart rate and SPO2 data (arrays of n values)
  hr: number[];        // Heart rate
  hr_valid: number[];  // Heart rate validity flag
  spo2: number[];      // Blood oxygen saturation
  spo2_valid: number[]; // SPO2 validity flag
  
  // Optical sensor data (arrays of n values)
  ir: number[];        // Infrared LED data
  red: number[];       // Red LED data
  
  // Temperature data (arrays of n values)
  temp_c: number[];    // Temperature in Celsius
  
  // Legacy fields for backward compatibility (optional)
  ax?: number[];
  ay?: number[];
  az?: number[];
  gx?: number[];
  gy?: number[];
  gz?: number[];
  bpm?: number[];
  date?: string;
  mpu6050?: MPU6050Data;
  max30102?: MAX30102Data;
}

// Legacy types for backward compatibility
export interface MPU6050Data {
  accelX: number;
  accelY: number;
  accelZ: number;
  gyroX: number;
  gyroY: number;
  gyroZ: number;
  temperature?: number;
}

export interface MAX30102Data {
  heartRate: number;
  spo2: number;
  temperature?: number;
}

export interface DashboardStats {
  avgHeartRate: number;
  avgSpo2: number;
  totalSteps: number;
  activeDuration: number;
  heartRateTrend: number; // percentage change
  spo2Trend: number; // percentage change
  stepsTrend: number; // percentage change
}

export interface ChartDataPoint {
  timestamp: string;
  heartRate: number;
  spo2: number;
  accelMagnitude: number;
  steps: number;
}
