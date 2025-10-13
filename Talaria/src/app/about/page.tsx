"use client";

import { useRouter } from "next/navigation";
import { CardContent } from "@/components/ui/card";
import { FeatureCard } from "@/components/feature-card";
import { Info, Users, LayoutDashboard, ArrowLeft, Home, Image as ImageIcon, Brain, Github } from "lucide-react";
import { WaveBackground } from "@/components/wave-1";
import { Dock } from "@/components/ui/dock-two";
import { Button } from "@/components/ui/button";
import { RoadmapCard } from "@/components/roadmap-card";
import Link from "next/link";
import Image from "next/image";
import { MinimalFooter } from "@/components/minimal-footer";

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-6 sm:mb-8 hover:bg-white/80 text-sm sm:text-base"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Page Title */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
            About Talaria
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto px-4">
            Integrated Footwear System for Concurrent Cardiovascular and Gait Analysis
          </p>
        </div>

        {/* Mythology Origin Story */}
        <FeatureCard className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 mb-8 sm:mb-12">
          <CardContent className="p-6 sm:p-8 md:p-12">
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                  The Legend of Talaria
                </h2>
                <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-slate-400 via-blue-500 to-slate-600 mx-auto rounded-full"></div>
                <p className="text-slate-600 mt-4 italic text-sm sm:text-base">Where Ancient Mythology Meets Modern Innovation</p>
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
        <FeatureCard className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 mb-12">
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

        {/* Roadmap Section */}
        <FeatureCard className="mb-12">
          <CardContent className="p-8 md:p-12">
            <RoadmapCard 
              title="Project Roadmap"
              description="Our journey to revolutionize health monitoring"
              items={[
                {
                  quarter: "1",
                  title: "Hardware Integration",
                  description: "MPU6050 & MAX30102 sensor integration with ESP32",
                  status: "done"
                },
                {
                  quarter: "2",
                  title: "Cloud Platform",
                  description: "Firebase real-time database & web dashboard",
                  status: "done"
                },
                {
                  quarter: "3",
                  title: "ML Analytics",
                  description: "Machine learning models for gait pattern analysis",
                  status: "done"
                },
                {
                  quarter: "4",
                  title: "Mobile App",
                  description: "Cross-platform mobile application release",
                  status: "done"
                }
              ]}
            />
          </CardContent>
        </FeatureCard>

        {/* Interactive Circuit Diagram */}
        <FeatureCard className="mb-12">
          <CardContent className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Interactive Circuit Diagram</h2>
            <p className="text-slate-600 mb-6">
              Explore the complete circuit design for the Talaria system. This interactive diagram shows how all components are connected together.
            </p>
            <div style={{ position: 'relative', width: '100%', paddingTop: 'calc(max(56.25%, 400px))' }}>
              <iframe 
                src="https://app.cirkitdesigner.com/project/9fb7ac80-d92a-4b6f-9c52-4ed689a9e750?view=interactive_preview" 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                title="Talaria Circuit Diagram"
              />
            </div>
            <p style={{ marginTop: '16px', fontSize: '14px', color: '#64748b' }}>
              Edit this project interactively in{' '}
              <a 
                href="https://app.cirkitdesigner.com/project/9fb7ac80-d92a-4b6f-9c52-4ed689a9e750" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Cirkit Designer
              </a>
              .
            </p>
          </CardContent>
        </FeatureCard>

        {/* Hardware Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Hardware Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ESP32-S3 Card */}
            <div className="group relative rounded-md border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
              {/* Corner Decorators */}
              <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2 z-10"></span>
              <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2 z-10"></span>
              <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 z-10"></span>
              <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2 z-10"></span>
              
              {/* Image */}
              <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-blue-50 to-slate-50 overflow-hidden">
                <Image
                  src="/images/Hardware/esp32-s3.jpg"
                  alt="ESP32-S3 Mini Dev Board"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">ESP32-S3 Mini Dev Board</h3>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Microcontroller</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Powerful dual-core processor with built-in Wi-Fi and Bluetooth for wireless data transmission and real-time cloud connectivity.
                </p>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Dual-core Xtensa LX7 CPU</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Wi-Fi & Bluetooth 5.0</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Low power consumption</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MAX30102 Card */}
            <div className="group relative rounded-md border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
              {/* Corner Decorators */}
              <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2 z-10"></span>
              <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2 z-10"></span>
              <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 z-10"></span>
              <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2 z-10"></span>
              
              {/* Image */}
              <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-red-50 to-slate-50 overflow-hidden">
                <Image
                  src="/images/Hardware/MAX30102.png"
                  alt="MAX30102 Heart Rate and SpO2 Sensor"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">MAX30102 Sensor</h3>
                  <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Heart Rate & SpO2</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Integrated pulse oximetry and heart-rate monitor module for accurate cardiovascular health tracking.
                </p>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Heart rate monitoring</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Blood oxygen saturation</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>I2C communication interface</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MPU6050 Card */}
            <div className="group relative rounded-md border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
              {/* Corner Decorators */}
              <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2 z-10"></span>
              <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2 z-10"></span>
              <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 z-10"></span>
              <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2 z-10"></span>
              
              {/* Image */}
              <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-green-50 to-slate-50 overflow-hidden">
                <Image
                  src="/images/Hardware/MPU6050.jpg"
                  alt="MPU6050 Inertial Measurement Unit"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">MPU6050 IMU</h3>
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Motion Tracking</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  6-axis inertial measurement unit combining 3-axis accelerometer and 3-axis gyroscope for precise gait analysis.
                </p>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>3-axis accelerometer</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>3-axis gyroscope</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>DMP for motion processing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TP4056 Charging Module Card */}
            <div className="group relative rounded-md border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
              {/* Corner Decorators */}
              <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2 z-10"></span>
              <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2 z-10"></span>
              <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 z-10"></span>
              <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2 z-10"></span>
              
              {/* Image */}
              <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-purple-50 to-slate-50 overflow-hidden">
                <Image
                  src="/images/Hardware/TP4056.png"
                  alt="TP4056 USB Type-C Charging Module"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">TP4056 Charging Module</h3>
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Power Management</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  USB Type-C charging module with integrated protection circuits for safe and efficient LiPo battery charging.
                </p>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>USB Type-C input</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Overcharge protection</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>LED charge indicators</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3.7V LiPo Battery Card */}
            <div className="group relative rounded-md border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
              {/* Corner Decorators */}
              <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2 z-10"></span>
              <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2 z-10"></span>
              <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 z-10"></span>
              <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2 z-10"></span>
              
              {/* Image */}
              <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-amber-50 to-slate-50 overflow-hidden">
                <Image
                  src="/images/Hardware/LiPo Battery.jpg"
                  alt="3.7V 300mAh LiPo Battery"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">LiPo Battery</h3>
                  <span className="inline-block bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">Power Source</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Compact rechargeable lithium polymer battery providing portable power for extended operation time.
                </p>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>300mAh capacity</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Lightweight & compact</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Rechargeable via TP4056</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Software Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Software Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Firebase Realtime Database Card */}
            <div className="group relative rounded-md border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
              {/* Corner Decorators */}
              <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2 z-10"></span>
              <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2 z-10"></span>
              <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 z-10"></span>
              <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2 z-10"></span>
              
              {/* Image */}
              <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-orange-50 to-slate-50 overflow-hidden">
                <Image
                  src="/images/software/Firebase Realtime DB.jpg"
                  alt="Firebase Realtime Database"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Firebase Realtime Database</h3>
                  <span className="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">Backend</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Cloud-hosted NoSQL database for real-time data synchronization and storage of sensor readings.
                </p>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Real-time data sync</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Offline capabilities</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Automatic scaling</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Cloud Platform Card */}
            <div className="group relative rounded-md border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
              {/* Corner Decorators */}
              <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2 z-10"></span>
              <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2 z-10"></span>
              <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 z-10"></span>
              <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2 z-10"></span>
              
              {/* Image */}
              <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-purple-50 to-slate-50 overflow-hidden">
                <Image
                  src="/images/software/Google Cloud.jpg"
                  alt="Google Cloud Platform"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Google Cloud Platform</h3>
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Machine Learning</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  LSTM model hosted in Artifact Registry and deployed via Vertex AI for scalable time-series predictions.
                </p>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Artifact Registry storage</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Vertex AI deployment</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Cloud-based inference</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next.js & React Card */}
            <div className="group relative rounded-md border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
              {/* Corner Decorators */}
              <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2 z-10"></span>
              <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2 z-10"></span>
              <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 z-10"></span>
              <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2 z-10"></span>
              
              {/* Image */}
              <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-cyan-50 to-slate-50 overflow-hidden">
                <Image
                  src="/images/software/React_Next.jpg"
                  alt="Next.js and React Framework"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Next.js & React</h3>
                  <span className="inline-block bg-cyan-100 text-cyan-800 text-xs font-medium px-2.5 py-0.5 rounded">Frontend</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Modern web framework with React for building fast, interactive user interfaces and dashboards.
                </p>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Server-side rendering</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Component-based architecture</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>TypeScript support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* GitHub Card */}
            <div className="group relative rounded-md border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
              {/* Corner Decorators */}
              <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2 z-10"></span>
              <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2 z-10"></span>
              <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 z-10"></span>
              <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2 z-10"></span>
              
              {/* Image */}
              <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                <Image
                  src="/images/software/Github.jpg"
                  alt="GitHub Version Control"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">GitHub</h3>
                  <span className="inline-block bg-slate-100 text-slate-800 text-xs font-medium px-2.5 py-0.5 rounded">Version Control</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Open-source collaboration platform for version control and project management.
                </p>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Version control system</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Collaborative development</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Open-source community</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contribute Section */}
        <div className="mb-12 text-center">
          <FeatureCard className="bg-gradient-to-br from-slate-900 to-slate-700 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8 md:p-10">
              <div className="max-w-2xl mx-auto space-y-6">
                <Github className="w-12 h-12 text-white mx-auto" />
                <h2 className="text-3xl font-bold text-white">Join the Project</h2>
                <p className="text-lg text-slate-200 leading-relaxed">
                  Talaria is an open-source project. We welcome contributors from around the world 
                  to help us build the future of integrated health monitoring.
                </p>
                <Link 
                  href="https://github.com/Meet2304/Project-Talaria" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-base sm:text-lg px-8 bg-white text-slate-900 hover:bg-slate-100 border-0 mt-4"
                  >
                    <Github className="mr-2 h-5 w-5" />
                    View on GitHub
                  </Button>
                </Link>
              </div>
            </CardContent>
          </FeatureCard>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-20">
        <MinimalFooter />
      </div>
    </div>
  );
}
