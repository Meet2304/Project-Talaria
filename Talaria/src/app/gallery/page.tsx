"use client";

import { WaveBackground } from "@/components/wave-1";
import { Dock } from "@/components/ui/dock-two";
import InteractiveImageBentoGallery from "@/components/bento-gallery";
import { Home, Info, Users, LayoutDashboard, Image as ImageIcon, Brain } from "lucide-react";
import { useRouter } from "next/navigation";

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

      {/* Dock Navigation - Fixed to Bottom */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50">
        <Dock items={dockItems} />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-32 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 
            className="font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
            style={{ fontSize: 'clamp(3rem, 12vw, 8rem)' }}
          >
            Gallery
          </h1>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">
            Explore the design, development, and technology behind Talaria's innovative health monitoring footwear system
          </p>
        </div>
      </section>

      {/* Gallery Section - Uses default images from component */}
      <div className="relative z-10 pb-32">
        <InteractiveImageBentoGallery />
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 pb-24 text-center text-slate-600 text-sm relative z-10">
        <p>Made on Earth, by Humans</p>
        <p>&copy; 2025 Talaria. All rights reserved.</p>
      </footer>
    </div>
  );
}
