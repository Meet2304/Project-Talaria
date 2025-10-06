"use client";

import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { WaveBackground } from "@/components/wave-1";
import { Dock } from "@/components/ui/dock-two";
import { Info, Users, LayoutDashboard, Home, Image as ImageIcon, Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ML_MODELS, formatMetric, formatSamples, getColorClasses } from "@/lib/ml-models-config";

export default function AnalyticsPage() {
  const router = useRouter();

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
                      <CardTitle className="text-2xl">Analytics Dashboard</CardTitle>
                      <CardDescription>
                        Comprehensive analysis of your health and activity data
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>

                {/* KPI Cards */}
                <SectionCards />

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 lg:px-6">
                  {/* Primary Chart */}
                  <div className="lg:col-span-2">
                    <ChartAreaInteractive />
                  </div>

                  {/* ML Models Section */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">ML Model Performance</CardTitle>
                        <CardDescription>Real-time status and metrics of deployed models</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          {ML_MODELS.map((model) => {
                            const Icon = model.icon;
                            const colors = getColorClasses(model.color);
                            
                            return (
                              <div key={model.id} className="border border-slate-200 p-4 hover:border-slate-300 transition-colors">
                                {/* Model Header */}
                                <div className="flex items-center gap-3 mb-4">
                                  <div className={`p-2 ${colors.bg} border ${colors.border}`}>
                                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-semibold text-slate-900 text-sm">{model.name}</h3>
                                      <Badge 
                                        variant={model.status === "connected" ? "default" : "secondary"}
                                        className="text-xs h-5"
                                      >
                                        {model.status === "connected" ? "Active" : "Inactive"}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-slate-500">{model.type}</p>
                                  </div>
                                </div>

                                {/* Metrics */}
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                  <div className="bg-slate-50 p-2">
                                    <div className="text-xs text-slate-500">Accuracy</div>
                                    <div className="text-sm font-bold text-slate-900">{formatMetric(model.metrics.accuracy)}</div>
                                  </div>
                                  <div className="bg-slate-50 p-2">
                                    <div className="text-xs text-slate-500">F1 Score</div>
                                    <div className="text-sm font-bold text-slate-900">{formatMetric(model.metrics.f1Score)}</div>
                                  </div>
                                </div>

                                {/* Dataset */}
                                <div className="text-xs text-slate-600 bg-slate-50 p-2">
                                  <span className="font-semibold">{formatSamples(model.dataset.samples)}</span> training samples
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Additional Chart Placeholders */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Heart Rate Zones</CardTitle>
                      <CardDescription>Distribution across different intensity zones</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                        Coming Soon: Heart Rate Zone Analysis
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>SpO2 Variability</CardTitle>
                      <CardDescription>Blood oxygen fluctuations over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                        Coming Soon: SpO2 Variability Chart
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Gait Analysis</CardTitle>
                      <CardDescription>Step patterns and walking metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                        Coming Soon: Gait Pattern Analysis
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Heatmap</CardTitle>
                      <CardDescription>When you&apos;re most active during the day</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                        Coming Soon: Activity Heatmap
                      </div>
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
