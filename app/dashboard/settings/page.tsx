"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { teamService } from "@/lib/team-service"
import type { Team } from "@/lib/types"

export default function SettingsPage() {
  const { toast } = useToast()
  const [team, setTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [teamName, setTeamName] = useState("")

  useEffect(() => {
    const fetchTeam = async () => {
      setIsLoading(true)
      try {
        const currentTeam = await teamService.getCurrentTeam()
        setTeam(currentTeam)
        setTeamName(currentTeam.name)
      } catch (error) {
        console.error("Error fetching team:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeam()
  }, [])

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (team) {
        await teamService.updateTeam(team.id, { name: teamName })
        toast({
          title: "Team updated",
          description: "Your team settings have been updated successfully.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update team settings. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <p>Loading team settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Settings</h1>
        <p className="text-muted-foreground">Manage your team settings and preferences</p>
      </div>

      <Card>
        <form onSubmit={handleUpdateTeam}>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Update your team's basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input id="team-name" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-id">Team ID</Label>
              <Input id="team-id" value={team?.id || ""} disabled />
              <p className="text-sm text-muted-foreground">This is your unique team identifier</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>Irreversible actions that affect your team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-destructive p-4">
            <h3 className="text-lg font-medium">Delete Team</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Once you delete your team, all of your data will be permanently removed. This action cannot be undone.
            </p>
            <Button variant="destructive" className="mt-4">
              Delete Team
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
