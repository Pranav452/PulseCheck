"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { DashboardNav } from "@/components/dashboard-nav"

export function AppHeader() {
  const pathname = usePathname()
  const isAuthenticated = pathname !== "/" && pathname !== "/login" && pathname !== "/signup"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold">PulseCheck</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex">
                <ModeToggle />
              </div>
              <UserNav />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                  <div className="px-2 py-6">
                    <DashboardNav />
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <ModeToggle />
          )}
        </div>
      </div>
    </header>
  )
}
