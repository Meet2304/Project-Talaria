"use client";

import { useRouter } from "next/navigation";
import { useAllSensorData } from "@/hooks/use-sensor-data";
import { SensorReading } from "@/types/sensor";
import { AppSidebar } from "@/components/app-sidebar"
import { SensorDataDetailedTable } from "@/components/sensor-data-detailed-table"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { WaveBackground } from "@/components/wave-1";
import { Dock } from "@/components/ui/dock-two";
import { Info, Users, LayoutDashboard, Download, Home, Image as ImageIcon, Brain, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DatabasePage() {
  const router = useRouter();
  const { data: sensorReadings, loading, error, lastUpdate, refresh } = useAllSensorData(); // Get ALL readings with refresh

  const dockItems = [
    {
      icon: Home,
      label: "Home",
      onClick: () => {
        router.push("/");
      },
    },
    {
      icon: Info,
      label: "About",
      onClick: () => {
        router.push("/about");
      },
    },
    {
      icon: Users,
      label: "Team",
      onClick: () => {
        router.push("/team");
      },
    },
    {
      icon: ImageIcon,
      label: "Gallery",
      onClick: () => {
        router.push("/gallery");
      },
    },
    {
      icon: Brain,
      label: "ML Models",
      onClick: () => {
        router.push("/ml-models");
      },
    },
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      onClick: () => {
        router.push("/dashboard");
      },
    },
  ];

  // Function to export data as JSON
  const exportAsJSON = () => {
    const dataStr = JSON.stringify(sensorReadings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `talaria-sensor-data-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Helper to calculate average of an array
  const avg = (arr: number[]) => {
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  };

  // Calculate database statistics - filter valid readings first
  const validReadings = sensorReadings.filter(
    (r: SensorReading) => (r.hr || r.bpm) && Array.isArray(r.hr || r.bpm) && (r.spo2 || r.ir) && Array.isArray(r.spo2 || r.ir)
  );

  const stats = {
    total: sensorReadings.length,
    avgHeartRate: validReadings.length > 0
      ? Math.round(validReadings.reduce((sum: number, r: SensorReading) => sum + avg(r.hr || r.bpm || []), 0) / validReadings.length)
      : 0,
    avgSpo2: validReadings.length > 0
      ? Math.round((validReadings.reduce((sum: number, r: SensorReading) => sum + avg(r.spo2 || r.ir || []), 0) / validReadings.length) * 10) / 10
      : 0,
    timeSpan: sensorReadings.length > 1 && sensorReadings[0] && sensorReadings[sensorReadings.length - 1]
      ? Math.round((sensorReadings[0].timestamp - sensorReadings[sensorReadings.length - 1].timestamp) / 3600000)
      : 0,
    totalSamples: sensorReadings.reduce((sum: number, r: SensorReading) => sum + (r.n || 0), 0),
    totalSteps: sensorReadings.reduce((sum: number, r: SensorReading) => sum + (r.steps_in_batch || 0), 0),
  };

  return (
    <div className="relative min-h-screen">
      {/* Wave Background */}
      <WaveBackground />

      {/* Dock Navigation - Fixed to Bottom */}
      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50">
        <Dock items={dockItems} />
      </div>

      {/* Dashboard Content */}
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {/* Page Header */}
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl">Firebase Realtime Database</CardTitle>
                          <CardDescription>
                            Complete sensor readings from Firebase - Real-time updates enabled
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={refresh}
                            disabled={loading}
                            variant="outline"
                            size="sm"
                          >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                          </Button>
                          <Button
                            onClick={exportAsJSON}
                            disabled={loading || sensorReadings.length === 0}
                            variant="outline"
                            size="sm"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export JSON
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Total Readings</p>
                          <p className="text-2xl font-bold">
                            {loading ? "..." : stats.total.toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Total Samples</p>
                          <p className="text-2xl font-bold">
                            {loading ? "..." : stats.totalSamples.toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Total Steps</p>
                          <p className="text-2xl font-bold">
                            {loading ? "..." : stats.totalSteps.toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Avg Heart Rate</p>
                          <p className="text-2xl font-bold">
                            {loading ? "..." : `${stats.avgHeartRate} BPM`}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Avg SpO2</p>
                          <p className="text-2xl font-bold">
                            {loading ? "..." : `${stats.avgSpo2}%`}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Time Span</p>
                          <p className="text-2xl font-bold">
                            {loading ? "..." : `${stats.timeSpan} hrs`}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-500/10">
                              <span className="h-2 w-2  bg-green-500 mr-2 animate-pulse" />
                              Live Connection
                            </Badge>
                            <span className="text-muted-foreground">
                              Last updated:{" "}
                              <span className="font-semibold text-foreground">
                                {loading
                                  ? "..."
                                  : lastUpdate.toLocaleTimeString()}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sensor Data Table - Detailed View with All 50 Samples */}
                <div className="px-4 lg:px-6">
                  {error ? (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center text-red-500">
                          Error loading data: {error}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <SensorDataDetailedTable data={sensorReadings} loading={loading} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

