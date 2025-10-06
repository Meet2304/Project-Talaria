"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";

export function FirebaseDebugReadings() {
  const [rawData, setRawData] = useState<any>(null);
  const [count, setCount] = useState<number>(0);
  const [sampleReading, setSampleReading] = useState<any>(null);

  useEffect(() => {
    const deviceId = "gsl9JXZVy2U4ajwRjg4pDcLZ17j2";
    const sensorRef = ref(database, `devices/${deviceId}/readings`);

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const keys = Object.keys(data);
        setCount(keys.length);
        
        // Get first reading with full details
        const firstKey = keys[0];
        const firstReading = data[firstKey];
        setSampleReading({
          key: firstKey,
          fullData: firstReading,
          hasMax30102: !!firstReading.max30102,
          hasMpu6050: !!firstReading.mpu6050,
          max30102Keys: firstReading.max30102 ? Object.keys(firstReading.max30102) : [],
          mpu6050Keys: firstReading.mpu6050 ? Object.keys(firstReading.mpu6050) : [],
          max30102Values: firstReading.max30102,
          mpu6050Values: firstReading.mpu6050,
        });
        
        // Get first 2 complete readings
        const sample = keys.slice(0, 2).map(key => data[key]);
        setRawData(sample);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 border rounded shadow-lg max-w-2xl z-50 max-h-[80vh] overflow-auto">
      <h3 className="font-bold mb-2">Firebase Debug - Data Structure Analysis</h3>
      <p className="mb-2"><strong>Total readings:</strong> {count}</p>
      
      <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded">
        <h4 className="font-semibold mb-1">Structure Check:</h4>
        {sampleReading && (
          <div className="text-xs">
            <p>Has max30102: {String(sampleReading.hasMax30102)}</p>
            <p>Has mpu6050: {String(sampleReading.hasMpu6050)}</p>
            <p>max30102 keys: {sampleReading.max30102Keys.join(', ') || 'none'}</p>
            <p>mpu6050 keys: {sampleReading.mpu6050Keys.join(', ') || 'none'}</p>
          </div>
        )}
      </div>
      
      <h4 className="font-semibold mb-1">Sample Reading:</h4>
      <pre className="text-xs overflow-auto bg-gray-50 p-2 rounded">
        {JSON.stringify(rawData, null, 2)}
      </pre>
    </div>
  );
}
