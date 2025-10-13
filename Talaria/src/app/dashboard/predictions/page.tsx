"use client";

import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { WaveBackground } from "@/components/wave-1";
import { Dock } from "@/components/ui/dock-two";
import { Info, Users, LayoutDashboard, Home, Image as ImageIcon, Brain } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VertexAIInferenceInterface } from "@/components/vertex-ai-inference-interface";

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
      <WaveBackground />
      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50">
        <Dock items={dockItems} />
      </div>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">AI-Powered Gait Analysis</CardTitle>
                      <CardDescription>
                        Run inference on the LSTM model deployed to Google Cloud Vertex AI using 50 samples of sensor data
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
                <div className="px-4 lg:px-6">
                  <VertexAIInferenceInterface />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
