"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { FeatureCard } from "@/components/feature-card";
import { Activity, Heart, Footprints, TrendingUp, Info, Users, LayoutDashboard, Home as HomeIcon, Image as ImageIcon, Brain, Github } from "lucide-react";
import { WaveBackground } from "@/components/wave-1";
import { Dock } from "@/components/ui/dock-two";
import Link from "next/link";
import Image from "next/image";
import { MinimalFooter } from "@/components/minimal-footer";

export default function Home() {
  const router = useRouter();

  const dockItems = [
    {
      icon: HomeIcon,
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

      {/* Dock Navigation - Fixed to Bottom (visible on all screen sizes) */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50">
        <Dock items={dockItems} />
      </div>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 text-center relative z-10">
        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 lg:space-y-16">
          <div className="space-y-6 sm:space-y-8">
            <h1 className="font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] xl:text-[14rem]">
              TALARIA
            </h1>
          </div>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-700 max-w-2xl mx-auto px-4">
            Advanced real-time monitoring system combining cardiovascular health metrics 
            with precise gait analysis for comprehensive health insights.
          </p>

          <div className="flex gap-3 sm:gap-4 justify-center flex-wrap px-4">
            <Button 
              size="lg" 
              className="text-base sm:text-lg px-6 sm:px-8 bg-slate-900 hover:bg-slate-800 w-full sm:w-auto"
              onClick={() => router.push("/dashboard")}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base sm:text-lg px-6 sm:px-8 border-slate-900 text-slate-900 hover:bg-slate-100 w-full sm:w-auto"
              onClick={() => router.push("/about")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Mythology Story Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
        <FeatureCard className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
          <CardContent className="p-6 sm:p-8 md:p-12">
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                  The Legend of Talaria
                </h2>
                <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-slate-400 via-blue-500 to-slate-600 mx-auto rounded-full"></div>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm p-4 sm:p-6 border-l-4 border-blue-500">
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                  In the legends of Greek mythology, the god <span className="font-bold text-slate-900">Hermes</span> was gifted the <span className="font-bold text-slate-900">Talaria</span>—golden winged sandals that granted him the power of flight, swiftness, and the ability to journey between worlds. They symbolized speed, agility, and the divine gift of connection.
                </p>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                  Inspired by the Talaria of Hermes—the golden winged sandals that let the messenger god soar between worlds—<b>Project Talaria</b> reimagines that myth for the modern age. It bridges body and mind, transforming every step into insight. Like Hermes, it empowers you to move with speed, balance, and purpose—transcending limits and unlocking the power within each stride.
                </p>
              </div>
              </div>

              <div className="bg-slate-900 text-white p-6 sm:p-8 mt-6 sm:mt-8 shadow-lg">
                <p className="text-lg sm:text-xl leading-relaxed italic text-center font-light">
                  &ldquo;Just as the winged sandals carried Hermes between realms, Project Talaria carries you toward a deeper understanding of yourself—one step at a time.&rdquo;
                </p>
              </div>
          </CardContent>
        </FeatureCard>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-32 relative z-10">
        <div className="mx-auto max-w-2xl lg:max-w-5xl">
        {/* Section Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Features
          </h2>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-slate-400 via-blue-500 to-slate-600 mx-auto rounded-full"></div>
        </div>

        <div className="mx-auto grid gap-4 lg:grid-cols-2">
          {/* Heart Rate Monitoring */}
          <FeatureCard>
            <div className="p-4">
              <span className="text-slate-600 flex items-center gap-2 text-sm sm:text-base">
            <Heart className="size-4" />
            Heart Rate Monitoring
              </span>
              <p className="mt-4 sm:mt-8 text-xl sm:text-2xl font-semibold">Real-time cardiovascular tracking with MAX30102 sensor</p>
            </div>

            <div className="relative border-t border-dashed overflow-hidden">
              <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_75%,hsl(var(--muted)),white_125%)]"></div>
              <div className="aspect-square relative">
                <Image
                  src="/images/features/Heart Rate.png"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                  alt="Heart rate monitoring visualization"
                />
              </div>
            </div>
          </FeatureCard>

          {/* SpO2 Monitoring */}
          <FeatureCard>
            <div className="p-4">
              <span className="text-slate-600 flex items-center gap-2 text-sm sm:text-base">
            <Activity className="size-4" />
            SpO2 Monitoring
              </span>
              <p className="mt-4 sm:mt-8 text-xl sm:text-2xl font-semibold">Continuous blood oxygen saturation tracking</p>
            </div>

            
            <div className="relative border-t border-dashed overflow-hidden">
              <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_75%,hsl(var(--muted)),white_125%)]"></div>
              <div className="aspect-square relative">
            <Image
              src="/images/features/SpO2.png"
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-110"
              alt="SpO2 monitoring visualization"
            />
              </div>
            </div>
          </FeatureCard>

          {/* Gait Analysis */}
          <FeatureCard>
            <div className="p-4">
              <span className="text-slate-600 flex items-center gap-2 text-sm sm:text-base">
            <Footprints className="size-4" />
            Gait Analysis
              </span>
              <p className="mt-4 sm:mt-8 text-xl sm:text-2xl font-semibold">Precise movement tracking with MPU6050 accelerometer</p>
            </div>

            <div className="relative border-t border-dashed overflow-hidden">
              <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_75%,hsl(var(--muted)),white_125%)]"></div>
              <div className="aspect-square relative">
            <Image
              src="/images/features/Gait Analysis.png"
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-110"
              alt="Gait analysis visualization"
            />
              </div>
            </div>
          </FeatureCard>

          {/* Live Analytics */}
          <FeatureCard>
            <div className="p-4">
              <span className="text-slate-600 flex items-center gap-2 text-sm sm:text-base">
            <TrendingUp className="size-4" />
            Live Analytics
              </span>
              <p className="mt-4 sm:mt-8 text-xl sm:text-2xl font-semibold">Real-time data visualization and comprehensive insights</p>
            </div>

            <div className="relative border-t border-dashed overflow-hidden">
              <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_75%,hsl(var(--muted)),white_125%)]"></div>
              <div className="aspect-square relative">
            <Image
              src="/images/features/Data Analytics.png"
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-110"
              alt="Live analytics dashboard visualization"
            />
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
        <FeatureCard className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
          <CardContent className="py-12 sm:py-16 px-6 sm:px-8 text-center">
            <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Ready to Monitor Your Health?
              </h2>
              <p className="text-base sm:text-lg text-slate-200">
                Experience the future of integrated health monitoring with Talaria
              </p>
              <Button 
                size="lg" 
                variant="secondary" 
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 bg-white text-slate-900 hover:bg-slate-100"
                onClick={() => router.push("/dashboard")}
              >
                Start Monitoring
              </Button>
            </div>
          </CardContent>
        </FeatureCard>
      </section>

      {/* Contribute Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <FeatureCard className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 hover:shadow-2xl transition-all duration-300">
          <CardContent className="py-12 sm:py-16 px-6 sm:px-8 text-center">
            <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
              <Github className="w-12 h-12 text-slate-900 mx-auto" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                Join the Project
              </h2>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
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
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 bg-slate-900 hover:bg-slate-800 mt-4"
                >
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </Button>
              </Link>
            </div>
          </CardContent>
        </FeatureCard>
      </section>

      {/* Footer */}
      <div className="relative z-10 pb-20">
        <MinimalFooter />
      </div>
    </div>
  );
}
