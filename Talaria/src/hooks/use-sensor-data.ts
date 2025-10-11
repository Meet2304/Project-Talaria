"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";
import { SensorReading, DashboardStats, ChartDataPoint } from "@/types/sensor";

export function useSensorData(limit: number = 100) {
  const [data, setData] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const rootRef = ref(database, '/');
      
      const unsubscribe = onValue(
        rootRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const allReadings: SensorReading[] = [];
            const rootData = snapshot.val();
            
            // Auto-detect Firebase structure (supports both 'devices' parent key or direct structure)
            const devicesData = rootData.devices && typeof rootData.devices === 'object' 
              ? rootData.devices 
              : rootData;
            
            // Iterate through all devices and extract readings
            Object.entries(devicesData).forEach(([deviceId, deviceData]: [string, any]) => {
              if (deviceData && typeof deviceData === 'object' && deviceData.readings) {
                Object.entries(deviceData.readings).forEach(([id, data]: [string, any]) => {
                  allReadings.push({
                    id,
                    device_id: deviceId,
                    ...data,
                    timestamp: data.ts || data.timestamp,
                  });
                });
              }
            });
            
            // Sort by timestamp (newest first) and apply limit
            allReadings.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            setData(allReadings.slice(0, limit));
          } else {
            setData([]);
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  }, [limit]);

  return { data, loading, error };
}

// Hook to fetch ALL sensor data without limit
export function useAllSensorData() {
  const [data, setData] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add trigger for manual refresh

  useEffect(() => {
    try {
      const rootRef = ref(database, '/');
      setLoading(true);

      const unsubscribe = onValue(
        rootRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const allReadings: SensorReading[] = [];
            const rootData = snapshot.val();
            
            // Auto-detect Firebase structure (supports both 'devices' parent key or direct structure)
            const devicesData = rootData.devices && typeof rootData.devices === 'object' 
              ? rootData.devices 
              : rootData;
            
            // Iterate through all devices and extract readings
            Object.entries(devicesData).forEach(([deviceId, deviceData]: [string, any]) => {
              if (deviceData && typeof deviceData === 'object' && deviceData.readings) {
                Object.entries(deviceData.readings).forEach(([id, data]: [string, any]) => {
                  allReadings.push({
                    id,
                    device_id: deviceId,
                    ...data,
                    timestamp: data.ts || data.timestamp,
                  });
                });
              }
            });
            
            // Sort by timestamp (newest first)
            allReadings.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            setData(allReadings);
            setLastUpdate(new Date());
          } else {
            setData([]);
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  }, [refreshTrigger]);

  // Manual refresh function - triggers a new subscription
  const refresh = () => {
    setLoading(true);
    setRefreshTrigger(prev => prev + 1); // Increment to trigger useEffect
  };

  return { data, loading, error, lastUpdate, refresh };
}

export function useLatestReading() {
  const { data, loading, error } = useSensorData(1);
  return {
    reading: data[0] || null,
    loading,
    error,
  };
}

export function useDashboardStats() {
  const { data, loading, error } = useSensorData(100);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (data.length > 0) {
      // Helper to calculate average of an array
      const avg = (arr: number[]) => {
        if (!arr || arr.length === 0) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
      };

      // Filter valid readings that have the required data arrays
      const validReadings = data.filter(r => 
        (r.hr || r.bpm) && 
        Array.isArray(r.hr || r.bpm) &&
        r.spo2 &&
        Array.isArray(r.spo2) &&
        (r.hr || r.bpm).length > 0
      );

      if (validReadings.length === 0) {
        // No valid data, set defaults
        setStats({
          avgHeartRate: 0,
          avgSpo2: 0,
          totalSteps: 0,
          activeDuration: 0,
          heartRateTrend: 0,
          spo2Trend: 0,
          stepsTrend: 0,
        });
        return;
      }

      // Calculate current averages from the arrays
      const currentData = validReadings.slice(0, Math.min(50, validReadings.length));
      const currentAvgHR = currentData.reduce((sum, r) => sum + avg(r.hr || r.bpm || []), 0) / currentData.length;
      const currentAvgSpo2 = currentData.reduce((sum, r) => sum + avg(r.spo2 || []), 0) / currentData.length;
      
      // Calculate previous averages for trend
      const prevData = validReadings.slice(50, Math.min(100, validReadings.length));
      const prevAvgHR = prevData.length > 0 
        ? prevData.reduce((sum, r) => sum + avg(r.hr || r.bpm || []), 0) / prevData.length 
        : currentAvgHR;
      const prevAvgSpo2 = prevData.length > 0
        ? prevData.reduce((sum, r) => sum + avg(r.spo2 || []), 0) / prevData.length
        : currentAvgSpo2;
      
      // Calculate trends
      const heartRateTrend = prevAvgHR > 0 ? ((currentAvgHR - prevAvgHR) / prevAvgHR) * 100 : 0;
      const spo2Trend = prevAvgSpo2 > 0 ? ((currentAvgSpo2 - prevAvgSpo2) / prevAvgSpo2) * 100 : 0;
      
      // Calculate total steps from steps_in_batch field
      const totalSteps = validReadings.reduce((sum, r) => sum + (r.steps_in_batch || 0), 0);
      const prevSteps = Math.max(0, validReadings.slice(50).reduce((sum, r) => sum + (r.steps_in_batch || 0), 0));
      const stepsTrend = prevSteps > 0 ? ((totalSteps - prevSteps) / prevSteps) * 100 : 0;
      
      // Calculate active duration (in minutes)
      const oldestTimestamp = validReadings[validReadings.length - 1]?.timestamp || Date.now();
      const newestTimestamp = validReadings[0]?.timestamp || Date.now();
      const activeDuration = Math.round((newestTimestamp - oldestTimestamp) / 60000);

      const calculatedStats = {
        avgHeartRate: Math.round(currentAvgHR),
        avgSpo2: Math.round(currentAvgSpo2 * 10) / 10,
        totalSteps,
        activeDuration,
        heartRateTrend: Math.round(heartRateTrend * 10) / 10,
        spo2Trend: Math.round(spo2Trend * 10) / 10,
        stepsTrend: Math.round(stepsTrend * 10) / 10,
      };

      setStats(calculatedStats);
    }
  }, [data]);

  return { stats, loading, error };
}

export function useChartData(limit: number = 50) {
  const { data, loading, error } = useSensorData(limit);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    if (data.length > 0) {
      // Helper to calculate average of an array
      const avg = (arr: number[]) => {
        if (!arr || arr.length === 0) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
      };

      // Filter valid readings and map to chart format
      const formattedData: ChartDataPoint[] = data
        .filter(reading => 
          (reading.hr || reading.bpm) &&
          (reading.spo2 || reading.ir) &&
          (reading.accX || reading.ax) &&
          (reading.accY || reading.ay) &&
          (reading.accZ || reading.az) &&
          Array.isArray(reading.hr || reading.bpm) &&
          Array.isArray(reading.spo2 || reading.ir) &&
          Array.isArray(reading.accX || reading.ax) &&
          Array.isArray(reading.accY || reading.ay) &&
          Array.isArray(reading.accZ || reading.az)
        )
        .map((reading) => {
          // Calculate averages from arrays
          const avgHR = avg(reading.hr || reading.bpm || []);
          const avgSpo2 = avg(reading.spo2 || reading.ir || []);
          const avgAx = avg(reading.accX || reading.ax || []);
          const avgAy = avg(reading.accY || reading.ay || []);
          const avgAz = avg(reading.accZ || reading.az || []);
          
          // Calculate acceleration magnitude
          const accelMagnitude = Math.sqrt(avgAx ** 2 + avgAy ** 2 + avgAz ** 2);

          return {
            timestamp: reading.timestamp.toString(), // Use actual timestamp for proper formatting
            heartRate: avgHR,
            spo2: avgSpo2,
            accelMagnitude: Math.round(accelMagnitude * 100) / 100,
            steps: reading.steps_in_batch || 0,
          };
        })
        .reverse(); // Show oldest to newest for chart

      setChartData(formattedData);
    }
  }, [data]);

  return { chartData, loading, error };
}

// Helper function to filter data by time range
export function filterDataByTimeRange(data: SensorReading[], timeRange: string): SensorReading[] {
  if (data.length === 0) return data;
  
  const now = Date.now();
  let cutoffTime = now;
  
  switch (timeRange) {
    case "1h":
      cutoffTime = now - (60 * 60 * 1000); // 1 hour
      break;
    case "7h":
      cutoffTime = now - (7 * 60 * 60 * 1000); // 7 hours
      break;
    case "7d":
      cutoffTime = now - (7 * 24 * 60 * 60 * 1000); // 7 days
      break;
    case "30d":
      cutoffTime = now - (30 * 24 * 60 * 60 * 1000); // 30 days
      break;
    default:
      return data;
  }
  
  return data.filter(reading => reading.timestamp >= cutoffTime);
}

// Hook for chart data with time-based filtering
export function useChartDataWithTimeFilter(timeRange: string = "7h") {
  const { data: allData, loading, error } = useAllSensorData();
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    if (allData.length > 0) {
      // Filter data by time range
      const filteredData = filterDataByTimeRange(allData, timeRange);
      
      // Helper to calculate average of an array
      const avg = (arr: number[]) => {
        if (!arr || arr.length === 0) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
      };

      // Filter valid readings and map to chart format
      const formattedData: ChartDataPoint[] = filteredData
        .filter(reading => 
          (reading.hr || reading.bpm) &&
          (reading.spo2 || reading.ir) &&
          Array.isArray(reading.hr || reading.bpm) &&
          Array.isArray(reading.spo2 || reading.ir)
        )
        .map((reading) => {
          // Calculate averages from arrays
          const avgHR = avg(reading.hr || reading.bpm || []);
          const avgSpo2 = avg(reading.spo2 || reading.ir || []);
          const avgAx = avg(reading.accX || reading.ax || []);
          const avgAy = avg(reading.accY || reading.ay || []);
          const avgAz = avg(reading.accZ || reading.az || []);
          
          // Calculate acceleration magnitude
          const accelMagnitude = Math.sqrt(avgAx ** 2 + avgAy ** 2 + avgAz ** 2);

          return {
            timestamp: reading.timestamp.toString(),
            heartRate: Math.round(avgHR),
            spo2: Math.round(avgSpo2 * 10) / 10,
            accelMagnitude: Math.round(accelMagnitude * 100) / 100,
            steps: reading.steps_in_batch || 0,
          };
        })
        .reverse(); // Show oldest to newest for chart

      setChartData(formattedData);
    }
  }, [allData, timeRange]);

  return { chartData, loading, error };
}
