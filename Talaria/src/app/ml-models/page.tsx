"use client";

import { WaveBackground } from "@/components/wave-1";
import { Dock } from "@/components/ui/dock-two";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Info, Users, LayoutDashboard, Image as ImageIcon, Brain, ExternalLink, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ML_MODELS, formatMetric, formatSamples, getColorClasses } from "@/lib/ml-models-config";
import { MinimalFooter } from "@/components/minimal-footer";

export default function MLModelsPage() {
  const router = useRouter();

  const dockItems = [
    {
      icon: Home,
      label: "Home",
      onClick: () => router.push("/"),
    },
    {
      icon: Info,
      label: "About",
      onClick: () => router.push("/about"),
    },
    {
      icon: Users,
      label: "Team",
      onClick: () => router.push("/team"),
    },
    {
      icon: ImageIcon,
      label: "Gallery",
      onClick: () => router.push("/gallery"),
    },
    {
      icon: Brain,
      label: "ML Models",
      onClick: () => router.push("/ml-models"),
    },
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      onClick: () => router.push("/dashboard"),
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Wave Background */}
      <WaveBackground />

      {/* Dock Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50">
        <Dock items={dockItems} />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center relative z-10">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          <h1 
            className="font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent text-3xl sm:text-5xl md:text-6xl"
          >
            ML Models
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto px-4">
            AI-powered models for health monitoring and analysis
          </p>
        </div>
      </section>

      {/* Models Grid - Side by Side */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 max-w-7xl">
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-16">
          {ML_MODELS.map((model) => {
            const Icon = model.icon;
            const colors = getColorClasses(model.color);
            
            return (
              <div key={model.id} className="bg-white border border-slate-200 p-4 sm:p-6 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className={`p-2 sm:p-3 ${colors.bg} border ${colors.border} flex-shrink-0`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900">{model.name}</h2>
                      <Badge 
                        variant={model.status === "connected" ? "default" : "secondary"}
                        className="text-xs flex-shrink-0"
                      >
                        {model.status === "connected" ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">{model.type}</p>
                  </div>
                </div>

                {/* Objective */}
                <div className="mb-6">
                  <p className="text-sm text-slate-600 leading-relaxed">{model.objective}</p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 p-3 border-l-2 border-slate-900">
                    <div className="text-xs text-slate-500 mb-1">Accuracy</div>
                    <div className="text-lg font-bold text-slate-900">{formatMetric(model.metrics.accuracy)}</div>
                  </div>
                  <div className="bg-slate-50 p-3 border-l-2 border-blue-500">
                    <div className="text-xs text-slate-500 mb-1">Precision</div>
                    <div className="text-lg font-bold text-slate-900">{formatMetric(model.metrics.precision)}</div>
                  </div>
                  <div className="bg-slate-50 p-3 border-l-2 border-green-500">
                    <div className="text-xs text-slate-500 mb-1">Recall</div>
                    <div className="text-lg font-bold text-slate-900">{formatMetric(model.metrics.recall)}</div>
                  </div>
                  <div className="bg-slate-50 p-3 border-l-2 border-purple-500">
                    <div className="text-xs text-slate-500 mb-1">F1 Score</div>
                    <div className="text-lg font-bold text-slate-900">{formatMetric(model.metrics.f1Score)}</div>
                  </div>
                </div>

                {/* Dataset Info */}
                <div className="mb-6 bg-slate-50 p-4 border-l-2 border-slate-300">
                  <div className="text-xs text-slate-500 mb-1">Training Dataset</div>
                  <div className="text-sm font-semibold text-slate-900">{formatSamples(model.dataset.samples)} samples</div>
                  <div className="text-xs text-slate-600 mt-1">{model.dataset.description}</div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link href={model.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="w-3 h-3 mr-2" />
                      GitHub
                    </Button>
                  </Link>
                  <Link href={model.dashboardUrl} className="flex-1">
                    <Button size="sm" className="w-full bg-slate-900 hover:bg-slate-800">
                      <Play className="w-3 h-3 mr-2" />
                      Try Model
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <div className="relative z-10 pb-20">
        <MinimalFooter />
      </div>
    </div>
  );
}
