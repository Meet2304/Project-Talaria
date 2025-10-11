"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, Database } from "lucide-react";

export function DatabaseDebugPanel() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [deviceCount, setDeviceCount] = useState(0);
  const [totalReadings, setTotalReadings] = useState(0);
  const [latestTimestamp, setLatestTimestamp] = useState<number | null>(null);
  const [devices, setDevices] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔍 Database Debug Panel - Starting diagnostics...");
    console.log("📡 Database URL:", database.app.options.databaseURL);

    const rootRef = ref(database, '/');
    
    const unsubscribe = onValue(
      rootRef,
      (snapshot) => {
        console.log("✅ Firebase connection successful!");
        console.log("📊 Data exists:", snapshot.exists());
        
        if (snapshot.exists()) {
          setConnected(true);
          const data = snapshot.val();
          const rootKeys = Object.keys(data);
          
          console.log("🔌 Root level keys:", rootKeys);
          console.log("📦 Full data structure:", JSON.stringify(data).substring(0, 500) + "...");
          
          let allDeviceIds: string[] = [];
          let totalCount = 0;
          let latestTs = 0;
          
          // Check if we have a 'devices' parent key
          if (data.devices && typeof data.devices === 'object') {
            console.log("📂 Found 'devices' parent key");
            const deviceIds = Object.keys(data.devices);
            console.log("🔌 Device IDs under 'devices':", deviceIds);
            allDeviceIds = deviceIds;
            
            deviceIds.forEach(deviceId => {
              const device = data.devices[deviceId];
              if (device.readings) {
                const readingCount = Object.keys(device.readings).length;
                totalCount += readingCount;
                console.log(`  📱 Device ${deviceId}: ${readingCount} readings`);
                
                // Find latest timestamp
                Object.values(device.readings).forEach((reading: any) => {
                  const ts = reading.ts || reading.timestamp || 0;
                  if (ts > latestTs) latestTs = ts;
                });
              } else {
                console.warn(`  ⚠️ Device ${deviceId} has no 'readings' key`);
              }
            });
          } else {
            // Direct device IDs at root level
            console.log("📂 Direct device structure (no 'devices' parent)");
            rootKeys.forEach(deviceId => {
              const device = data[deviceId];
              if (device && typeof device === 'object' && device.readings) {
                allDeviceIds.push(deviceId);
                const readingCount = Object.keys(device.readings).length;
                totalCount += readingCount;
                console.log(`  📱 Device ${deviceId}: ${readingCount} readings`);
                
                // Find latest timestamp
                Object.values(device.readings).forEach((reading: any) => {
                  const ts = reading.ts || reading.timestamp || 0;
                  if (ts > latestTs) latestTs = ts;
                });
              }
            });
          }
          
          setDevices(allDeviceIds);
          setDeviceCount(allDeviceIds.length);
          setTotalReadings(totalCount);
          setLatestTimestamp(latestTs);
          
          console.log("📈 Total readings across all devices:", totalCount);
          console.log("⏰ Latest timestamp:", new Date(latestTs).toLocaleString());
          
        } else {
          console.warn("⚠️ Database is empty!");
          setConnected(true);
          setDeviceCount(0);
          setTotalReadings(0);
        }
      },
      (err) => {
        console.error("❌ Firebase connection error:", err);
        setConnected(false);
        setError(err.message);
      }
    );

    return () => {
      console.log("🔌 Disconnecting debug listener");
      unsubscribe();
    };
  }, []);

  const formatTimestamp = (ts: number | null) => {
    if (!ts) return "No data";
    const date = new Date(ts);
    const now = Date.now();
    const diff = now - ts;
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return date.toLocaleString();
  };

  return (
    <Card className="border-dashed border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Connection Debug
        </CardTitle>
        <CardDescription>
          Real-time diagnostic information for Firebase Realtime Database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
          <span className="font-medium">Connection Status</span>
          {connected === null ? (
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3 animate-spin" />
              Checking...
            </Badge>
          ) : connected ? (
            <Badge variant="default" className="gap-1 bg-green-500">
              <CheckCircle2 className="h-3 w-3" />
              Connected
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <XCircle className="h-3 w-3" />
              Disconnected
            </Badge>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">Error:</p>
            <p className="text-xs text-red-500 dark:text-red-500 mt-1">{error}</p>
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Devices Found</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">{deviceCount}</p>
          </div>
          
          <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Total Readings</p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">{totalReadings}</p>
          </div>
        </div>

        {/* Latest Data */}
        <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
          <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Latest Data</p>
          <p className="text-sm text-green-700 dark:text-green-300 font-semibold">
            {formatTimestamp(latestTimestamp)}
          </p>
        </div>

        {/* Device List */}
        {devices.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Active Devices:</p>
            <div className="space-y-1">
              {devices.map(deviceId => (
                <div key={deviceId} className="p-2 bg-secondary rounded text-xs font-mono">
                  {deviceId}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="pt-3 border-t text-xs text-muted-foreground space-y-1">
          <p><strong>✅ If connected:</strong> Data should appear in tables above</p>
          <p><strong>⚠️ If no devices:</strong> Check if ESP32 is sending data</p>
          <p><strong>❌ If disconnected:</strong> Check .env.local Firebase credentials</p>
          <p className="pt-2 text-[10px] opacity-70">
            Open browser console (F12) for detailed logs
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
