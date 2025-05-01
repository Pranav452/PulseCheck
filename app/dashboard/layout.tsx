"use client"

import { AppNav } from "@/components/app-nav"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  
  // Handle redirection if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      redirect("/login")
    }
  }, [user, loading])

  // Show loading state while auth is being checked
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <AppNav />
      <main className="flex-1">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  )
}
