"use client";

import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { WaveBackground } from "@/components/wave-1";
import { Dock } from "@/components/ui/dock-two";
import { Info, Users, LayoutDashboard, TrendingUp, Activity, Footprints, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PredictionsPage() {
  const router = useRouter();

  const dockItems = [
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
      icon: LayoutDashboard,
      label: "Dashboard",
      onClick: () => {
        router.push("/dashboard");
      },
    },
  ];

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
                      <CardTitle className="text-2xl">AI-Powered Predictions</CardTitle>
                      <CardDescription>
                        Machine learning insights and health forecasts based on your sensor data
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>

                {/* Prediction Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 lg:px-6">
                  {/* Health Risk Assessment */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          Health Risk Assessment
                        </CardTitle>
                        <Badge variant="outline">Low Risk</Badge>
                      </div>
                      <CardDescription>
                        Predicted health risk based on vitals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Cardiovascular Risk</span>
                          <span className="font-semibold text-green-600">Low</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Respiratory Health</span>
                          <span className="font-semibold text-green-600">Normal</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Activity Level</span>
                          <span className="font-semibold text-blue-600">Moderate</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Heart Rate Forecast */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-red-600" />
                          Heart Rate Forecast
                        </CardTitle>
                        <Badge variant="outline">Next Hour</Badge>
                      </div>
                      <CardDescription>
                        Predicted average heart rate
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-3xl font-bold">72-76 BPM</div>
                        <div className="text-sm text-muted-foreground">
                          Based on current activity patterns and historical data
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Activity Prediction */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Footprints className="h-5 w-5 text-green-600" />
                          Activity Prediction
                        </CardTitle>
                        <Badge variant="outline">Today</Badge>
                      </div>
                      <CardDescription>
                        Estimated steps by end of day
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-3xl font-bold">8,500 Steps</div>
                        <div className="text-sm text-muted-foreground">
                          You&apos;re on track to meet your daily goal
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recovery Status */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-purple-600" />
                          Recovery Status
                        </CardTitle>
                        <Badge variant="outline">Excellent</Badge>
                      </div>
                      <CardDescription>
                        Predicted recovery time and readiness
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Recovery Score</span>
                          <span className="font-semibold text-green-600">92/100</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Readiness</span>
                          <span className="font-semibold text-green-600">High</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Recommended Rest</span>
                          <span className="font-semibold">None</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* ML Model Info */}
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About Predictions</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                      <p>
                        These predictions are generated using machine learning models trained on your historical
                        sensor data. The models analyze patterns in heart rate, SpO2, and movement data to provide
                        personalized insights.
                      </p>
                      <p className="font-semibold text-foreground">
                        Note: This feature is under development. Predictions shown are placeholder values for
                        demonstration purposes.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
