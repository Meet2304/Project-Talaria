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
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    try {
      const deviceId = "abJOOmcIBVV0oqiUVVYasBkznZa2"; // Updated device ID from JSON
      const sensorRef = ref(database, `devices/${deviceId}/readings`);
      const sensorQuery = query(sensorRef, orderByChild("ts")); // Order by 'ts' field

      // Real-time listener - automatically updates when Firebase data changes
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
  }, []);

  // Manual refresh function
  const refresh = () => {
    setLoading(true);
    setLastUpdate(new Date());
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
      
      // Calculate total steps (estimated from accelerometer data)
      const totalSteps = validReadings.reduce((sum, r) => sum + (r.n || 50), 0);
      const prevSteps = Math.max(0, validReadings.slice(50).reduce((sum, r) => sum + (r.n || 50), 0));
      const stepsTrend = prevSteps > 0 ? ((totalSteps - prevSteps) / prevSteps) * 100 : 0;
      
      // Calculate active duration (in minutes)
      const oldestTimestamp = validReadings[validReadings.length - 1]?.timestamp || Date.now();
      const newestTimestamp = validReadings[0]?.timestamp || Date.now();
      const activeDuration = Math.round((newestTimestamp - oldestTimestamp) / 60000);

      setStats({
        avgHeartRate: Math.round(currentAvgHR),
        avgSpo2: Math.round(currentAvgSpo2 * 10) / 10,
        totalSteps,
        activeDuration,
        heartRateTrend: Math.round(heartRateTrend * 10) / 10,
        spo2Trend: Math.round(spo2Trend * 10) / 10,
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
            timestamp: new Date(reading.timestamp).toLocaleTimeString(),
            heartRate: avgHR,
            spo2: avgSpo2,
            accelMagnitude: Math.round(accelMagnitude * 100) / 100,
          };
        })
        .reverse(); // Show oldest to newest for chart

      setChartData(formattedData);
    }
  }, [data]);

  return { chartData, loading, error };
}
