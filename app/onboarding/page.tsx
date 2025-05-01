"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { teamService } from "@/lib/team-service"
import { useAuth } from "@/lib/auth-context"
import { activityService } from "@/lib/activity-service"

export default function OnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [teamName, setTeamName] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const [activeTab, setActiveTab] = useState("create")

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const team = await teamService.createTeam(teamName)
      
      // Generate sample data
      await activityService.generateSampleData(team.id)
      
      toast({
        title: "Team created",
        description: "Your team has been created successfully.",
      })
      
      router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await teamService.joinTeam(inviteCode)
      
      toast({
        title: "Team joined",
        description: "You've successfully joined the team.",
      })
      
      router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid invitation code. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto flex items-center gap-2">
            <BarChart2 className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome to PulseCheck!</h1>
          <p className="text-sm text-muted-foreground">
            {user?.name ? `Great to have you here, ${user.name.split(' ')[0]}!` : 'Get started with your team'}
          </p>
        </div>

        <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Team</TabsTrigger>
            <TabsTrigger value="join">Join Team</TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <Card>
              <form onSubmit={handleCreateTeam}>
                <CardHeader>
                  <CardTitle>Create a Team</CardTitle>
                  <CardDescription>
                    Start tracking your team's activities and collaboration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="teamName">Team Name</Label>
                    <Input
                      id="teamName"
                      name="teamName"
                      placeholder="Acme Development"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Team"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="join">
            <Card>
              <form onSubmit={handleJoinTeam}>
                <CardHeader>
                  <CardTitle>Join a Team</CardTitle>
                  <CardDescription>
                    Enter the invite code shared by your team manager
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="inviteCode">Invite Code</Label>
                    <Input
                      id="inviteCode"
                      name="inviteCode"
                      placeholder="TEAM123ABC"
                      required
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Joining..." : "Join Team"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="px-8 text-center text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <a className="underline underline-offset-4 hover:text-primary" href="#">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="underline underline-offset-4 hover:text-primary" href="#">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}
