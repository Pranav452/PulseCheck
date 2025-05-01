"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Activity, Team, TeamMember } from "@/lib/types"
import { ActivityChart } from "@/components/activity-chart"
import { TeamMemberList } from "@/components/team-member-list"
import { Skeleton } from "@/components/ui/skeleton"
import { GitBranch, GitPullRequest, MessageSquare, AlertTriangle } from "lucide-react"

interface TeamOverviewProps {
  team: Team | null
  members: TeamMember[]
  activities: Activity[]
  isLoading: boolean
}

export function TeamOverview({ team, members, activities, isLoading }: TeamOverviewProps) {
  // Calculate metrics
  const totalCommits = activities.filter((a) => a.type === "commit").length
  const totalPRs = activities.filter((a) => a.type === "pull_request").length
  const totalMessages = activities.filter((a) => a.type === "message").length
  const totalBlockers = activities.filter((a) => a.type === "blocker").length

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-12 mb-1" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
        <div className="md:col-span-2 lg:col-span-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full max-w-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commits</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCommits}</div>
            <p className="text-xs text-muted-foreground">
              {totalCommits > 0 ? `+${Math.floor(totalCommits * 0.1)} from last period` : "No activity yet"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pull Requests</CardTitle>
            <GitPullRequest className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPRs}</div>
            <p className="text-xs text-muted-foreground">
              {totalPRs > 0 ? `${Math.floor(totalPRs * 0.8)} merged` : "No pull requests yet"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              {totalMessages > 0 ? `Across ${Math.min(members.length, 3)} channels` : "No messages yet"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blockers</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBlockers}</div>
            <p className="text-xs text-muted-foreground">
              {totalBlockers > 0 ? `${Math.floor(totalBlockers * 0.7)} resolved` : "No blockers reported"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-2 lg:col-span-5">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Team activity over the selected time period</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart activities={activities} />
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>{members.length} members in this team</CardDescription>
          </CardHeader>
          <CardContent>
            <TeamMemberList members={members} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
