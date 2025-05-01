"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { teamService } from "@/lib/team-service"
import { UserPlus, Copy, Check, Users, Settings, Trash2 } from "lucide-react"
import type { Team, TeamMember } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState("")
  const [newTeamName, setNewTeamName] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true)
      try {
        const userTeams = await teamService.getUserTeams()
        setTeams(userTeams)
        
        if (userTeams.length > 0) {
          setCurrentTeam(userTeams[0])
          const teamMembers = await teamService.getTeamMembers(userTeams[0].id)
          setMembers(teamMembers)
        }
      } catch (error) {
        console.error("Error fetching teams:", error)
        toast({
          title: "Error",
          description: "Failed to load teams. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeams()
  }, [])

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a team name",
        variant: "destructive",
      })
      return
    }

    try {
      const team = await teamService.createTeam(newTeamName)
      setTeams([...teams, team])
      setNewTeamName("")
      toast({
        title: "Success",
        description: "Team created successfully",
      })
    } catch (error) {
      console.error("Error creating team:", error)
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInviteMember = async () => {
    if (!currentTeam) return
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    try {
      await teamService.inviteMember(currentTeam.id, inviteEmail)
      setInviteEmail("")
      toast({
        title: "Success",
        description: `Invitation sent to ${inviteEmail}`,
      })
    } catch (error) {
      console.error("Error inviting member:", error)
      toast({
        title: "Error",
        description: "Failed to invite member. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!currentTeam) return
    if (currentTeam.ownerId === memberId) {
      toast({
        title: "Error",
        description: "You cannot remove the team owner",
        variant: "destructive",
      })
      return
    }

    try {
      await teamService.removeMember(currentTeam.id, memberId)
      setMembers(members.filter(member => member.id !== memberId))
      toast({
        title: "Success",
        description: "Member removed successfully",
      })
    } catch (error) {
      console.error("Error removing member:", error)
      toast({
        title: "Error",
        description: "Failed to remove member. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTeamChange = async (teamId: string) => {
    const team = teams.find(t => t.id === teamId)
    if (!team) return

    setCurrentTeam(team)
    try {
      const teamMembers = await teamService.getTeamMembers(team.id)
      setMembers(teamMembers)
    } catch (error) {
      console.error("Error fetching team members:", error)
      toast({
        title: "Error",
        description: "Failed to load team members. Please try again.",
        variant: "destructive",
      })
    }
  }

  const copyInviteCode = () => {
    if (!currentTeam?.inviteCode) return
    navigator.clipboard.writeText(`${window.location.origin}/join?code=${currentTeam.inviteCode}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Success",
      description: "Invite link copied to clipboard!",
    })
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    const parts = name.split(" ")
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">Manage your teams and team members</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>
                Enter a name for your new team
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input 
                  id="team-name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="My Awesome Team"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateTeam}>Create Team</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {teams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Teams Found</h3>
            <p className="text-muted-foreground mb-6">You haven't created or joined any teams yet.</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Create Your First Team</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                  <DialogDescription>
                    Enter a name for your new team
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="team-name">Team Name</Label>
                    <Input 
                      id="team-name"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="My Awesome Team"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleCreateTeam}>Create Team</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {currentTeam && (
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>{currentTeam.name}</CardTitle>
                    <CardDescription>
                      Team ID: {currentTeam.id}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <Button variant="outline" onClick={copyInviteCode}>
                      {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      Copy Invite Link
                    </Button>
                    <Button variant="outline">
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Settings</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Team Members</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {members.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={member.avatarUrl} alt={member.name} />
                                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-muted-foreground">{member.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>{member.role}</TableCell>
                            <TableCell>{new Date(member.joinedAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              {currentTeam.ownerId !== member.id && (
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(member.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Invite Members</h3>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1">
                        <Input 
                          placeholder="Email address" 
                          value={inviteEmail} 
                          onChange={(e) => setInviteEmail(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleInviteMember}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {teams.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Teams</CardTitle>
                <CardDescription>
                  Select a team to manage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {teams.map((team) => (
                    <Button
                      key={team.id}
                      variant={currentTeam?.id === team.id ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => handleTeamChange(team.id)}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      {team.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
} 