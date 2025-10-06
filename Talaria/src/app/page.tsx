"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Heart, Footprints, TrendingUp, Info, Users, LayoutDashboard } from "lucide-react";
import { WaveBackground } from "@/components/wave-1";
import { Dock } from "@/components/ui/dock-two";

export default function Home() {
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
    <div className="min-h-screen relative">
      {/* Wave Background */}
      <WaveBackground />

      {/* Dock Navigation - Fixed to Bottom */}
      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50">
        <Dock items={dockItems} />
      </div>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-32 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Talaria
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 font-light">
              Integrated Footwear System for Concurrent<br />
              Cardiovascular and Gait Analysis
            </p>
          </div>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Advanced real-time monitoring system combining cardiovascular health metrics 
            with precise gait analysis for comprehensive health insights.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              className="text-lg px-8 bg-slate-900 hover:bg-slate-800"
              onClick={() => router.push("/dashboard")}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 border-slate-900 text-slate-900 hover:bg-slate-100"
              onClick={() => router.push("/about")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Key Features</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Combining cutting-edge sensor technology with real-time analytics
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Heart Rate</h3>
                <p className="text-slate-600 text-sm">
                  Real-time cardiovascular monitoring with MAX30102 sensor
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">SpO2 Levels</h3>
                <p className="text-slate-600 text-sm">
                  Continuous blood oxygen saturation tracking
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Footprints className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Gait Analysis</h3>
                <p className="text-slate-600 text-sm">
                  Precise movement tracking with MPU6050 accelerometer
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Live Analytics</h3>
                <p className="text-slate-600 text-sm">
                  Real-time data visualization and insights
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 relative z-10 pb-32">
        <Card className="border-none shadow-xl bg-gradient-to-r from-slate-900 to-slate-700 text-white">
          <CardContent className="py-16 px-8 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Monitor Your Health?
              </h2>
              <p className="text-lg text-slate-200">
                Experience the future of integrated health monitoring with Talaria
              </p>
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-lg px-8 bg-white text-slate-900 hover:bg-slate-100"
                onClick={() => router.push("/dashboard")}
              >
                Start Monitoring
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 pb-24 text-center text-slate-600 text-sm relative z-10">
        <p>Made on Earth, by Humans</p>
        <p>&copy; 2025 Talaria. All rights reserved.</p>
      </footer>
    </div>
  );
}
