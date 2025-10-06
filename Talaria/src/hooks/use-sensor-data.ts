"use client";

import { useEffect, useState } from "react";
import { ref, onValue, query, orderByChild, limitToLast } from "firebase/database";
import { database } from "@/lib/firebase";
import { SensorReading, DashboardStats, ChartDataPoint } from "@/types/sensor";

export function useSensorData(limit: number = 100) {
  const [data, setData] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const deviceId = "gsl9JXZVy2U4ajwRjg4pDcLZ17j2";
      const sensorRef = ref(database, `devices/${deviceId}/readings`);
      const sensorQuery = query(sensorRef, orderByChild("ts"), limitToLast(limit)); // Order by 'ts' field
      
      const unsubscribe = onValue(
        sensorQuery,
        (snapshot) => {
          if (snapshot.exists()) {
            const readings: SensorReading[] = [];
            snapshot.forEach((childSnapshot) => {
              const data = childSnapshot.val();
              readings.push({
                id: childSnapshot.key as string,
                ...data,
                timestamp: data.ts || data.timestamp, // Map 'ts' to 'timestamp'
              });
            });
            setData(readings.reverse()); // Most recent first
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

  useEffect(() => {
    try {
      const deviceId = "gsl9JXZVy2U4ajwRjg4pDcLZ17j2";
      const sensorRef = ref(database, `devices/${deviceId}/readings`);
      const sensorQuery = query(sensorRef, orderByChild("ts")); // Order by 'ts' field

      const unsubscribe = onValue(
        sensorQuery,
        (snapshot) => {
          if (snapshot.exists()) {
            const readings: SensorReading[] = [];
            snapshot.forEach((childSnapshot) => {
              const data = childSnapshot.val();
              readings.push({
                id: childSnapshot.key as string,
                ...data,
                timestamp: data.ts || data.timestamp, // Map 'ts' to 'timestamp'
              });
            });
            setData(readings.reverse()); // Most recent first
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
  }, []);

  return { data, loading, error };
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
        r.bpm && 
        Array.isArray(r.bpm) &&
        r.ir &&
        Array.isArray(r.ir) &&
        r.bpm.length > 0
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
      // Each reading has 50 samples, we calculate the average across all readings
      const currentData = validReadings.slice(0, Math.min(50, validReadings.length));
      const currentAvgHR = currentData.reduce((sum, r) => sum + avg(r.bpm), 0) / currentData.length;
      const currentAvgIR = currentData.reduce((sum, r) => sum + avg(r.ir), 0) / currentData.length;
      
      // Calculate previous averages for trend
      const prevData = validReadings.slice(50, Math.min(100, validReadings.length));
      const prevAvgHR = prevData.length > 0 
        ? prevData.reduce((sum, r) => sum + avg(r.bpm), 0) / prevData.length 
        : currentAvgHR;
      const prevAvgIR = prevData.length > 0
        ? prevData.reduce((sum, r) => sum + avg(r.ir), 0) / prevData.length
        : currentAvgIR;
      
      // Calculate trends
      const heartRateTrend = prevAvgHR > 0 ? ((currentAvgHR - prevAvgHR) / prevAvgHR) * 100 : 0;
      const irTrend = prevAvgIR > 0 ? ((currentAvgIR - prevAvgIR) / prevAvgIR) * 100 : 0;
      
      // Calculate total steps (estimated from accelerometer data)
      const totalSteps = validReadings.length * 50; // Rough estimate: 50 samples per reading
      const prevSteps = Math.max(0, (validReadings.length - 50) * 50);
      const stepsTrend = prevSteps > 0 ? ((totalSteps - prevSteps) / prevSteps) * 100 : 0;
      
      // Calculate active duration (in minutes)
      const oldestTimestamp = validReadings[validReadings.length - 1]?.timestamp || Date.now();
      const newestTimestamp = validReadings[0]?.timestamp || Date.now();
      const activeDuration = Math.round((newestTimestamp - oldestTimestamp) / 60000);

      setStats({
        avgHeartRate: Math.round(currentAvgHR),
        avgSpo2: Math.round(currentAvgIR * 10) / 10, // Using IR as proxy for SpO2
        totalSteps,
        activeDuration,
        heartRateTrend: Math.round(heartRateTrend * 10) / 10,
        spo2Trend: Math.round(irTrend * 10) / 10,
        stepsTrend: Math.round(stepsTrend * 10) / 10,
      });
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
          reading.bpm &&
          reading.ir &&
          reading.ax &&
          reading.ay &&
          reading.az &&
          Array.isArray(reading.bpm) &&
          Array.isArray(reading.ir) &&
          Array.isArray(reading.ax) &&
          Array.isArray(reading.ay) &&
          Array.isArray(reading.az)
        )
        .map((reading) => {
          // Calculate averages from arrays
          const avgBpm = avg(reading.bpm);
          const avgIR = avg(reading.ir);
          const avgAx = avg(reading.ax);
          const avgAy = avg(reading.ay);
          const avgAz = avg(reading.az);
          
          // Calculate acceleration magnitude
          const accelMagnitude = Math.sqrt(avgAx ** 2 + avgAy ** 2 + avgAz ** 2);

          return {
            timestamp: new Date(reading.timestamp).toLocaleTimeString(),
            heartRate: avgBpm,
            spo2: avgIR, // Using IR as proxy for SpO2
            accelMagnitude: Math.round(accelMagnitude * 100) / 100,
          };
        })
        .reverse(); // Show oldest to newest for chart

      setChartData(formattedData);
    }
  }, [data]);

  return { chartData, loading, error };
}
