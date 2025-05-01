"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamOverview } from "@/components/team-overview"
import { ActivityFeed } from "@/components/activity-feed"
import { TeamMetrics } from "@/components/team-metrics"
import { TeamSelector } from "@/components/team-selector"
import { DateRangePicker } from "@/components/date-range-picker"
import { activityService } from "@/lib/activity-service"
import { teamService } from "@/lib/team-service"
import type { Activity, Team, TeamMember } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { DateRange } from "react-day-picker"

export default function DashboardPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [team, setTeam] = useState<Team | null>(null)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Check if we have a session first
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.error("Dashboard: No active session found");
          window.location.href = "/login";
          return;
        }
        
        console.log("Dashboard: Session found", session.user?.email);
        
        const currentTeam = await teamService.getCurrentTeam()
        setTeam(currentTeam)

        const teamMembers = await teamService.getTeamMembers(currentTeam.id)
        setMembers(teamMembers)

        const teamActivities = await activityService.getTeamActivities(
          currentTeam.id, 
          dateRange.from as Date, 
          dateRange.to as Date
        )
        setActivities(teamActivities)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your team's activity and collaboration metrics</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <TeamSelector team={team} />
          <DateRangePicker 
            dateRange={dateRange} 
            onDateRangeChange={handleDateRangeChange} 
          />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="metrics">Team Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <TeamOverview team={team} members={members} activities={activities} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <ActivityFeed activities={activities} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <TeamMetrics 
            activities={activities} 
            members={members} 
            startDate={dateRange.from as Date} 
            endDate={dateRange.to as Date}
            isLoading={isLoading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
