"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, LogOut, Settings, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { authService } from "@/lib/auth-service"

export function DashboardNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: BarChart2,
    },
    {
      title: "Team Members",
      href: "/dashboard/members",
      icon: Users,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  const handleLogout = async () => {
    await authService.logout()
    window.location.href = "/"
  }

  return (
    <nav className="flex flex-col gap-2">
      <div className="text-lg font-semibold mb-2">Navigation</div>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.title}
        </Link>
      ))}
      <div className="mt-auto pt-4">
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </nav>
  )
}
