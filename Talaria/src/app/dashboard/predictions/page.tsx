"use client";

import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { WaveBackground } from "@/components/wave-1";
import { Dock } from "@/components/ui/dock-two";
import { Info, Users, LayoutDashboard, Home, Image as ImageIcon, Brain, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ML_MODELS, formatMetric, formatSamples, getColorClasses } from "@/lib/ml-models-config";
import Link from "next/link";

export default function PredictionsPage() {
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
                      <CardTitle className="text-2xl">AI-Powered Predictions</CardTitle>
                      <CardDescription>
                        Machine learning insights based on your sensor data
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>

                {/* ML Model Predictions - Dynamic from Config */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 lg:px-6">
                  {ML_MODELS.map((model) => {
                    const Icon = model.icon;
                    const colors = getColorClasses(model.color);
                    
                    return (
                      <Card key={model.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-3">
                              <div className={`p-2 ${colors.bg} border ${colors.border}`}>
                                <Icon className={`h-5 w-5 ${colors.icon}`} />
                              </div>
                              <span className="text-lg">{model.name}</span>
                            </CardTitle>
                            <Badge 
                              variant={model.status === "connected" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {model.status === "connected" ? "Active" : "Not Connected"}
                            </Badge>
                          </div>
                          <CardDescription className="ml-14">
                            {model.type} • {model.objective}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="ml-14 space-y-4">
                          {/* Model Performance Metrics */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 p-3 border-l-2 border-slate-900">
                              <div className="text-xs text-slate-500 mb-1">Accuracy</div>
                              <div className="text-lg font-bold text-slate-900">
                                {formatMetric(model.metrics.accuracy)}
                              </div>
                            </div>
                            <div className="bg-slate-50 p-3 border-l-2 border-blue-500">
                              <div className="text-xs text-slate-500 mb-1">Precision</div>
                              <div className="text-lg font-bold text-slate-900">
                                {formatMetric(model.metrics.precision)}
                              </div>
                            </div>
                            <div className="bg-slate-50 p-3 border-l-2 border-green-500">
                              <div className="text-xs text-slate-500 mb-1">Recall</div>
                              <div className="text-lg font-bold text-slate-900">
                                {formatMetric(model.metrics.recall)}
                              </div>
                            </div>
                            <div className="bg-slate-50 p-3 border-l-2 border-purple-500">
                              <div className="text-xs text-slate-500 mb-1">F1 Score</div>
                              <div className="text-lg font-bold text-slate-900">
                                {formatMetric(model.metrics.f1Score)}
                              </div>
                            </div>
                          </div>

                          {/* Dataset Info */}
                          <div className="bg-slate-50 p-3 border-l-2 border-slate-300">
                            <div className="text-xs text-slate-500 mb-1">Training Dataset</div>
                            <div className="text-sm font-semibold text-slate-900">
                              {formatSamples(model.dataset.samples)} samples
                            </div>
                            <div className="text-xs text-slate-600 mt-1">
                              {model.dataset.description}
                            </div>
                          </div>

                          {/* Use Cases */}
                          <div>
                            <div className="text-xs font-semibold text-slate-700 mb-2">Key Use Cases:</div>
                            <ul className="space-y-1">
                              {model.useCases.slice(0, 3).map((useCase, idx) => (
                                <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                                  <span className="text-slate-400">•</span>
                                  <span>{useCase}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Action Button */}
                          <Link href={model.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="w-full">
                              <ExternalLink className="w-3 h-3 mr-2" />
                              View Model on GitHub
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* ML Model Info */}
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About These Models</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                      <p>
                        These machine learning models are trained on sensor data from the Talaria system.
                        Each model analyzes specific aspects of your health and activity patterns to provide
                        personalized predictions and insights.
                      </p>
                      <p className="font-semibold text-foreground">
                        {ML_MODELS.filter(m => m.status === "connected").length === 0 
                          ? "Note: No models are currently connected. Once connected, predictions will be displayed here."
                          : `Active Models: ${ML_MODELS.filter(m => m.status === "connected").length} of ${ML_MODELS.length}`
                        }
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
