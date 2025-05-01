"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, Settings, Users } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar className="hidden md:flex">
        <SidebarHeader className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-purple-600" />
            <span className="text-lg font-bold">PulseCheck</span>
          </div>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                <Link href="/dashboard">
                  <BarChart2 className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard/members"}>
                <Link href="/dashboard/members">
                  <Users className="h-5 w-5" />
                  <span>Team Members</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard/settings"}>
                <Link href="/dashboard/settings">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <div className="text-xs text-muted-foreground">PulseCheck v1.0.0</div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
