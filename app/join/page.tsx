"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { teamService } from "@/lib/team-service"
import { useAuth } from "@/lib/auth-context"
import { Users, ArrowRight, Loader2 } from "lucide-react"

export default function JoinPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const [inviteCode, setInviteCode] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const [isProcessingInvite, setIsProcessingInvite] = useState(false)

  // Get invite code from URL query parameters
  useEffect(() => {
    const code = searchParams.get("code")
    if (code) {
      setInviteCode(code)
      if (user) {
        handleJoinTeam(code)
      }
    }
  }, [searchParams, user])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      // Store the invite code in session storage to retrieve after login
      if (inviteCode) {
        sessionStorage.setItem("pendingInviteCode", inviteCode)
      }
      router.push("/login?redirect=/join")
    }
  }, [user, authLoading, router, inviteCode])

  // Check for pending invite after login
  useEffect(() => {
    if (user && !isProcessingInvite) {
      const pendingCode = sessionStorage.getItem("pendingInviteCode")
      if (pendingCode) {
        setInviteCode(pendingCode)
        handleJoinTeam(pendingCode)
        sessionStorage.removeItem("pendingInviteCode")
      }
    }
  }, [user, isProcessingInvite])

  const handleJoinTeam = async (code: string) => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter an invite code",
        variant: "destructive",
      })
      return
    }

    setIsJoining(true)
    setIsProcessingInvite(true)
    
    try {
      await teamService.joinTeam(code)
      toast({
        title: "Success",
        description: "You've successfully joined the team!",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Error joining team:", error)
      toast({
        title: "Error",
        description: "Failed to join team. The invite code may be invalid.",
        variant: "destructive",
      })
    } finally {
      setIsJoining(false)
      setIsProcessingInvite(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Join Team</CardTitle>
          <CardDescription>
            Enter an invite code to join a team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-code">Invite Code</Label>
            <Input
              id="invite-code"
              placeholder="Enter invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              disabled={isJoining}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => handleJoinTeam(inviteCode)}
            disabled={isJoining}
          >
            {isJoining ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Users className="mr-2 h-4 w-4" />
            )}
            {isJoining ? "Joining..." : "Join Team"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 