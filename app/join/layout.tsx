"use client"

import { useEffect, useState } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { BarChart2 } from "lucide-react"
import Link from "next/link"
import "../globals.css"

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration errors
  if (!mounted) {
    return null
  }

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <header className="bg-background border-b">
              <div className="container flex h-16 items-center">
                <Link href="/" className="flex items-center gap-2">
                  <BarChart2 className="h-6 w-6 text-purple-600" />
                  <span className="text-xl font-bold">PulseCheck</span>
                </Link>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
} 