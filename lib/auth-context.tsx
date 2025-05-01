"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "./types"
import { supabase } from "./supabase"
import { authService } from "./auth-service"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (data: { email: string; password: string }) => Promise<void>
  signup: (data: { name: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Initial session check
    const checkUser = async () => {
      try {
        console.log("AuthProvider: Checking current user");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthProvider: Session error", error);
          setLoading(false);
          return;
        }
        
        if (!session) {
          console.log("AuthProvider: No session found");
          setLoading(false);
          return;
        }
        
        console.log("AuthProvider: Session found", session);
        
        try {
          const user = await authService.getCurrentUser()
          console.log("AuthProvider: User retrieved", user);
          setUser(user)
        } catch (userError) {
          console.error("AuthProvider: Error retrieving user", userError);
        }
      } catch (error) {
        console.error("AuthProvider: Error checking auth status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AuthProvider: Auth state changed", event, session?.user?.email);
        
        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
          try {
            const user = await authService.getCurrentUser()
            console.log("AuthProvider: User updated in state", user);
            setUser(user)
          } catch (error) {
            console.error("AuthProvider: Error updating user", error);
          }
        } else if (event === "SIGNED_OUT") {
          console.log("AuthProvider: User signed out");
          setUser(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (data: { email: string; password: string }) => {
    console.log("AuthProvider: Login attempt", data.email);
    setLoading(true)
    try {
      const user = await authService.login(data)
      console.log("AuthProvider: Login successful", user);
      setUser(user)
      router.push("/dashboard")
    } catch (error) {
      console.error("AuthProvider: Login failed", error);
      throw error;
    } finally {
      setLoading(false)
    }
  }

  const signup = async (data: { name: string; email: string; password: string }) => {
    console.log("AuthProvider: Signup attempt", data.email);
    setLoading(true)
    try {
      const user = await authService.signup(data)
      console.log("AuthProvider: Signup successful", user);
      setUser(user)
      router.push("/onboarding")
    } catch (error) {
      console.error("AuthProvider: Signup failed", error);
      throw error;
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    console.log("AuthProvider: Logout attempt");
    setLoading(true)
    try {
      await authService.logout()
      console.log("AuthProvider: Logout successful");
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("AuthProvider: Logout failed", error);
      throw error;
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 