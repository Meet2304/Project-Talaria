"use client";

import { useRouter } from "next/navigation";
import { CardContent } from "@/components/ui/card";
import { FeatureCard } from "@/components/feature-card";
import { Activity, Heart, Footprints, TrendingUp, Info, Users, LayoutDashboard, ArrowLeft, Home, Image as ImageIcon, Brain } from "lucide-react";
import { WaveBackground } from "@/components/wave-1";
import { Dock } from "@/components/ui/dock-two";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
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
    <div className="min-h-screen relative">
      {/* Wave Background */}
      <WaveBackground />

      {/* Dock Navigation - Fixed to Bottom */}
      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50">
        <Dock items={dockItems} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-8 hover:bg-white/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
            About Talaria
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Integrated Footwear System for Concurrent Cardiovascular and Gait Analysis
          </p>
        </div>

        {/* Mythology Origin Story */}
        <FeatureCard className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 mb-12">
          <CardContent className="p-8 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                  The Legend of Talaria
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-slate-400 via-blue-500 to-slate-600 mx-auto rounded-full"></div>
                <p className="text-slate-600 mt-4 italic">Where Ancient Mythology Meets Modern Innovation</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm p-6 border-l-4 border-blue-500">
                <p className="text-lg text-slate-700 leading-relaxed">
                  In the legends of Greek mythology, the god <span className="font-bold text-slate-900">Hermes</span> was gifted the <span className="font-bold text-slate-900">Talaria</span>—golden winged sandals that granted him the power of flight, swiftness, and the ability to journey between worlds. They symbolized speed, agility, and the divine gift of connection.
                </p>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-slate-900">Bridging Worlds</h3>
                <p className="text-lg text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900">Project Talaria</span> carries this spirit into the modern age. Just as Hermes used the Talaria to bridge the realms of gods and mortals, this innovation bridges the gap between human movement and deeper self-awareness. By embedding intelligence into footwear, Project Talaria transforms every step into insight—tracking motion, stride, and heart rhythm to empower individuals with knowledge about their health, vitality, and performance.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-slate-900">Elevating Human Potential</h3>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Project Talaria is more than technology; it is a call to elevate human potential. It embodies the timeless pursuit of strength, speed, and balance, inspiring us to not only move forward but to move with purpose. Through every stride, it reminds us that like Hermes, we too can transcend limits and walk closer to greatness.
                </p>
              </div>

              <div className="bg-slate-900 text-white p-8 mt-8 shadow-lg">
                <p className="text-xl leading-relaxed italic text-center font-light">
                  &ldquo;Just as the winged sandals carried Hermes between realms, Project Talaria carries you toward a deeper understanding of yourself—one step at a time.&rdquo;
                </p>
              </div>
            </div>
          </CardContent>
        </FeatureCard>

        {/* Mission Section */}
        <FeatureCard className="mb-12">
          <CardContent className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-4">
              Talaria is revolutionizing health monitoring by combining cardiovascular and gait analysis 
              into a single, integrated footwear system. Our mission is to provide comprehensive health 
              insights through real-time data collection and advanced analytics.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              By leveraging cutting-edge sensor technology including the MPU6050 accelerometer/gyroscope 
              and MAX30102 heart rate and SpO2 sensor, we deliver accurate, actionable health data that 
              empowers users to make informed decisions about their wellbeing.
            </p>
          </CardContent>
        </FeatureCard>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-red-100 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Heart Rate Monitoring</h3>
                  <p className="text-slate-600 text-sm">
                    Real-time cardiovascular monitoring with MAX30102 sensor for accurate BPM tracking
                  </p>
                </div>
              </CardContent>
            </FeatureCard>

            <FeatureCard>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">SpO2 Levels</h3>
                  <p className="text-slate-600 text-sm">
                    Continuous blood oxygen saturation tracking to monitor respiratory health
                  </p>
                </div>
              </CardContent>
            </FeatureCard>

            <FeatureCard>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-green-100 flex items-center justify-center">
                    <Footprints className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Gait Analysis</h3>
                  <p className="text-slate-600 text-sm">
                    Precise movement tracking with MPU6050 for comprehensive gait patterns
                  </p>
                </div>
              </CardContent>
            </FeatureCard>

            <FeatureCard>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-purple-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Live Analytics</h3>
                  <p className="text-slate-600 text-sm">
                    Real-time data visualization and insights powered by Firebase
                  </p>
                </div>
              </CardContent>
            </FeatureCard>
          </div>
        </div>

        {/* Technology Section */}
        <FeatureCard>
          <CardContent className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Hardware</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>MPU6050:</strong> 6-axis accelerometer and gyroscope for precise motion tracking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>MAX30102:</strong> Integrated pulse oximetry and heart-rate monitor</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Wireless Communication:</strong> Real-time data transmission to cloud</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Software</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Next.js & React:</strong> Modern web application framework</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Firebase:</strong> Real-time database for live data streaming</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>TypeScript:</strong> Type-safe development for reliability</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </FeatureCard>
      </div>
    </div>
  );
}
