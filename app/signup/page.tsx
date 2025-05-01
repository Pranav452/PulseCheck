"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"

export default function SignupPage() {
  const { signup, loading } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [connectionStatus, setConnectionStatus] = useState<string>("Checking connection...")

  useEffect(() => {
    // Test Supabase connection on page load
    const testConnection = async () => {
      try {
        // Try a simple query to test connection
        const { data, error } = await supabase.from('users').select('count');
        if (error) {
          console.error("Supabase connection error:", error);
          setConnectionStatus(`Database error: ${error.message}`);
        } else {
          setConnectionStatus("Connected to Supabase");
        }
      } catch (err) {
        console.error("Connection test error:", err);
        setConnectionStatus("Failed to connect to Supabase");
      }
    };

    testConnection();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Signup attempt with:", formData.email);

    try {
      // Direct Supabase auth for testing
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (error) {
        console.error("Direct auth error:", error);
        throw error;
      }

      console.log("Auth result:", data);
      
      // Use the auth context method
      await signup(formData)
      console.log("Signup successful via context");
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      })
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      })
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <BarChart2 className="h-6 w-6 text-purple-600" />
        <span className="text-lg font-bold">PulseCheck</span>
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
          <div className="text-xs text-muted-foreground">{connectionStatus}</div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
