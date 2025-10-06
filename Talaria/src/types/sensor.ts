// Sensor data types based on actual Firebase structure
// Each reading contains arrays of 50 samples
export interface SensorReading {
  id: string;
  timestamp: number; // ts field in Firebase
  client_ts_ms: number;
  device_id: string;
  n: number; // number of samples (50)
  sample_rate_ms: number; // 100ms
  
  // Accelerometer data (arrays of 50 values)
  ax: number[];
  ay: number[];
  az: number[];
  
  // Gyroscope data (arrays of 50 values)
  gx: number[];
  gy: number[];
  gz: number[];
  
  // Heart rate and IR sensor data (arrays of 50 values)
  bpm: number[];
  ir: number[];
  
  // Legacy fields for backward compatibility (optional)
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
}
