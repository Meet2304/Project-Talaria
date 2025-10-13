"use client"

import * as React from "react"
import Image from "next/image"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  DatabaseIcon,
  SettingsIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Database",
      url: "/dashboard/database",
      icon: DatabaseIcon,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChartIcon,
    },
    {
      title: "Predictions",
      url: "/dashboard/predictions",
      icon: ArrowUpCircleIcon,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard" className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800  px-3 py-2">
                <div className="relative w-14 h-14">
                  <Image 
                    src="/images/Assets/Talaria_Logo_TR.png" 
                    alt="Talaria Logo" 
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-base font-semibold text-white">TALARIA</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}

