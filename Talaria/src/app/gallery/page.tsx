"use client";

import { WaveBackground } from "@/components/wave-1";
import { Dock } from "@/components/ui/dock-two";
import InteractiveImageBentoGallery from "@/components/bento-gallery";
import { Home, Info, Users, LayoutDashboard, Image as ImageIcon, Brain } from "lucide-react";
import { useRouter } from "next/navigation";
import { MinimalFooter } from "@/components/minimal-footer";

export default function GalleryPage() {
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

      {/* Dock Navigation - Fixed to Bottom (visible on all screen sizes) */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50">
        <Dock items={dockItems} />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <h1 
            className="font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Gallery
          </h1>
          <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto px-4">
            Explore the design, development, and technology behind Talaria&apos;s innovative health monitoring footwear system
          </p>
        </div>
      </section>

      {/* Gallery Section - Uses default images from component */}
      <div className="relative z-10 pb-24 sm:pb-32">
        <InteractiveImageBentoGallery />
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-20">
        <MinimalFooter />
      </div>
    </div>
  );
}
