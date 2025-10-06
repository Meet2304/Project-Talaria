"use client";

import { useEffect, useState } from "react";
import { ref, get, onValue } from "firebase/database";
import { database } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function FirebaseDebug() {
  const [connectionStatus, setConnectionStatus] = useState<string>("Checking...");
  const [rawData, setRawData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [configStatus, setConfigStatus] = useState<any>({});

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check environment variables
        const config = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };

        setConfigStatus(config);

        console.warn("🔥 Firebase Configuration Check:");
        console.warn("API Key:", config.apiKey ? "✓ Set" : "✗ MISSING");
        console.warn("Database URL:", config.databaseURL ? `✓ ${config.databaseURL}` : "✗ MISSING");
        console.warn("Project ID:", config.projectId ? "✓ Set" : "✗ MISSING");

        if (!config.databaseURL) {
          setError("CRITICAL: NEXT_PUBLIC_FIREBASE_DATABASE_URL is not set in .env.local");
          setConnectionStatus("✗ Configuration Error");
          return;
        }

        // Try to read from root
        console.warn("🔍 Attempting to read from root path '/'...");
        const rootRef = ref(database, "/");
        const snapshot = await get(rootRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          setRawData(data);
          const availablePaths = Object.keys(data);
          setPaths(availablePaths);
          setConnectionStatus("✓ Connected - Data found at root");
          console.warn("✓ Root data structure:", availablePaths);
          console.warn("✓ Full data:", data);
        } else {
          setConnectionStatus("✓ Connected - Database is empty");
          console.warn("⚠️ Database exists but contains no data");
        }

        // Try specific paths
        const pathsToCheck = ["/readings", "/sensorReadings", "/devices", "/data"];

        console.warn("\n🔍 Checking specific paths:");
        for (const path of pathsToCheck) {
          const pathRef = ref(database, path);
          const pathSnapshot = await get(pathRef);
          if (pathSnapshot.exists()) {
            const pathData = pathSnapshot.val();
            console.warn(`✓ Data found at '${path}':`, pathData);
          } else {
            console.warn(`✗ No data at '${path}'`);
          }
        }

        // Set up real-time listener on /readings
        console.warn("\n🔴 Setting up real-time listener on /readings...");
        const readingsRef = ref(database, "readings");
        onValue(readingsRef, (snapshot) => {
          if (snapshot.exists()) {
            console.warn("🔴 LIVE UPDATE - Data received from /readings:", snapshot.val());
          } else {
            console.warn("🔴 LIVE UPDATE - No data at /readings");
          }
        });

      } catch (err: any) {
        setError(err.message);
        setConnectionStatus("✗ Connection failed");
        console.error("❌ Firebase Error:", err);
        console.error("Error details:", {
          name: err.name,
          message: err.message,
          code: err.code,
          stack: err.stack
        });
      }
    };

    checkConnection();
  }, []);

  return (
    <Card className="w-full mx-auto mb-8 border-2 border-blue-500">
      <CardHeader className="bg-blue-50">
        <CardTitle className="flex items-center gap-2">
          🔥 Firebase Debug Panel
          <Badge variant={connectionStatus.includes("✓") ? "default" : "destructive"}>
            {connectionStatus.includes("✓") ? "Connected" : "Error"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div>
          <h3 className="font-semibold mb-2 text-lg">Connection Status:</h3>
          <p className={`text-lg font-mono ${connectionStatus.includes("✓") ? "text-green-600" : "text-red-600"}`}>
            {connectionStatus}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-500 rounded p-4">
            <h3 className="font-semibold mb-2 text-red-600 text-lg">❌ Error:</h3>
            <pre className="text-sm overflow-auto text-red-800 whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        <div className="bg-slate-50 rounded p-4">
          <h3 className="font-semibold mb-2">Environment Variables:</h3>
          <ul className="text-sm space-y-1 font-mono">
            <li className={configStatus.apiKey ? "text-green-600" : "text-red-600"}>
              {configStatus.apiKey ? "✓" : "✗"} NEXT_PUBLIC_FIREBASE_API_KEY: {configStatus.apiKey ? "Set" : "MISSING"}
            </li>
            <li className={configStatus.databaseURL ? "text-green-600" : "text-red-600"}>
              {configStatus.databaseURL ? "✓" : "✗"} NEXT_PUBLIC_FIREBASE_DATABASE_URL: {configStatus.databaseURL || "MISSING"}
            </li>
            <li className={configStatus.projectId ? "text-green-600" : "text-red-600"}>
              {configStatus.projectId ? "✓" : "✗"} NEXT_PUBLIC_FIREBASE_PROJECT_ID: {configStatus.projectId ? "Set" : "MISSING"}
            </li>
            <li className={configStatus.authDomain ? "text-green-600" : "text-red-600"}>
              {configStatus.authDomain ? "✓" : "✗"} NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: {configStatus.authDomain ? "Set" : "MISSING"}
            </li>
          </ul>
        </div>

        {paths.length > 0 && (
          <div className="bg-green-50 border-2 border-green-500 rounded p-4">
            <h3 className="font-semibold mb-2 text-green-700 text-lg">✓ Available Paths in Database:</h3>
            <ul className="list-disc list-inside space-y-1">
              {paths.map((path) => (
                <li key={path} className="text-sm font-mono text-green-800 font-semibold">/{path}</li>
              ))}
            </ul>
          </div>
        )}

        {rawData && (
          <div className="bg-slate-50 rounded p-4">
            <h3 className="font-semibold mb-2">Raw Database Data:</h3>
            <pre className="text-xs overflow-auto max-h-96 bg-white p-4 rounded border">
              {JSON.stringify(rawData, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-yellow-50 border-2 border-yellow-500 rounded p-4">
          <h3 className="font-semibold mb-2 text-yellow-800">📋 Instructions:</h3>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>Open browser console (F12) to see detailed logs</li>
            <li>Check if environment variables are all set</li>
            <li>Verify the available paths match your Firebase structure</li>
            <li>If no paths shown, your database might be empty or rules block access</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
