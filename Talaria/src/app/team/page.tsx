"use client";

import { useRouter } from "next/navigation";
import { Info, Users, LayoutDashboard, ArrowLeft } from "lucide-react";
import { WaveBackground } from "@/components/wave-1";
import { Dock } from "@/components/ui/dock-two";
import { Button } from "@/components/ui/button";
import TeamSection from "@/components/team";

export default function TeamPage() {
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

      {/* Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
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
        <div className="text-center mb-0">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-0">
            Our Team
          </h1>
          {/* <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Meet the dedicated professionals behind Talaria
          </p> */}
        </div>

        {/* Team Section Component */}
        <TeamSection />
      </div>
    </div>
  );
}
