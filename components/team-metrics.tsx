"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis, 
  PolarRadiusAxis,
  Radar,
  Treemap,
  AreaChart,
  Area
} from "recharts"
import { Users, BarChart2, Clock, Network, AlertCircle, Activity, UserCircle, GitCommit, GitPullRequest, MessagesSquare } from "lucide-react"
import type { Activity as ActivityType, TeamMember } from "@/lib/types"

interface TeamMetricsProps {
  activities: ActivityType[]
  members: TeamMember[]
  startDate: Date
  endDate: Date
  isLoading?: boolean
}

export function TeamMetrics({ activities, members, startDate, endDate, isLoading = false }: TeamMetricsProps) {
  const [activeTab, setActiveTab] = useState("overview")
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }
  
  // Calculate metrics if there are activities
  const periodDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) || 30
  
  // Count unique active days
  const activeDays = new Set(
    activities.map(a => new Date(a.timestamp).toISOString().split('T')[0])
  ).size
  
  // Calculate activity frequency
  const activityFrequency = activeDays / periodDays
  
  // Calculate average activities per day
  const avgActivitiesPerDay = activities.length / periodDays
  
  // Calculate percentage of blocker activities
  const blockersCount = activities.filter(a => a.type === 'blocker').length
  const blockerPercentage = activities.length > 0 ? (blockersCount / activities.length) * 100 : 0
  
  // Total number of team members who have activities
  const activeMembers = new Set(activities.map(a => a.user.id)).size
  
  // Activity type distribution
  const activityTypeData = [
    { name: "Commits", value: activities.filter(a => a.type === "commit").length, color: "#22c55e" },
    { name: "Pull Requests", value: activities.filter(a => a.type === "pull_request").length, color: "#3b82f6" },
    { name: "Messages", value: activities.filter(a => a.type === "message").length, color: "#a855f7" },
    { name: "Blockers", value: activities.filter(a => a.type === "blocker").length, color: "#ef4444" }
  ]
  
  // Member activity data
  const memberActivityData = () => {
    // Group activities by member and count by type
    const memberActivity = {}
    
    activities.forEach(activity => {
      if (!memberActivity[activity.user.id]) {
        memberActivity[activity.user.id] = {
          name: activity.user.name,
          commit: 0,
          pull_request: 0,
          message: 0,
          blocker: 0,
          total: 0
        }
      }
      
      memberActivity[activity.user.id][activity.type]++
      memberActivity[activity.user.id].total++
    })
    
    // Convert to array and sort by total activities
    return Object.values(memberActivity)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5) // Top 5 members
  }
  
  // Top contributors
  const topContributors = () => {
    const contributors = {}
    
    activities.forEach(activity => {
      if (!contributors[activity.user.id]) {
        contributors[activity.user.id] = {
          id: activity.user.id,
          name: activity.user.name,
          count: 0
        }
      }
      contributors[activity.user.id].count++
    })
    
    return Object.values(contributors)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }
  
  // Activity timeline
  const activityTimeline = () => {
    // Create all dates in range
    const dateMap = {}
    
    let currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      dateMap[dateStr] = {
        date: dateStr,
        commits: 0,
        pull_requests: 0,
        messages: 0,
        blockers: 0,
        total: 0
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    // Count activities by date
    activities.forEach(activity => {
      const dateStr = new Date(activity.timestamp).toISOString().split('T')[0]
      if (dateMap[dateStr]) {
        dateMap[dateStr].total++
        
        if (activity.type === "commit") dateMap[dateStr].commits++
        else if (activity.type === "pull_request") dateMap[dateStr].pull_requests++
        else if (activity.type === "message") dateMap[dateStr].messages++
        else if (activity.type === "blocker") dateMap[dateStr].blockers++
      }
    })
    
    // Convert to array and sort by date
    return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date))
  }
  
  // Daily activity patterns
  const dailyActivityPatterns = () => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: 0
    }))
    
    // Count activities by hour
    activities.forEach(activity => {
      const date = new Date(activity.timestamp)
      const hour = date.getHours()
      hours[hour].count++
    })
    
    return hours
  }
  
  // Team collaboration data
  const collaborationData = () => {
    // Group activities by day and user
    const activityByDay = {}
    
    activities.forEach(activity => {
      const day = new Date(activity.timestamp).toISOString().split('T')[0]
      if (!activityByDay[day]) {
        activityByDay[day] = new Set()
      }
      activityByDay[day].add(activity.user.id)
    })
    
    // Count days with multiple team members active
    const collaborationDays = Object.values(activityByDay).filter(userSet => (userSet as Set<string>).size > 1).length
    const totalDays = Object.keys(activityByDay).length
    
    // Create treemap data
    const memberCollaboration = {}
    
    Object.entries(activityByDay).forEach(([day, userSet]) => {
      const users = Array.from(userSet as Set<string>)
      if (users.length > 1) {
        // Count collaboration between each pair of users
        for (let i = 0; i < users.length; i++) {
          for (let j = i + 1; j < users.length; j++) {
            const pair = [users[i], users[j]].sort().join('-')
            if (!memberCollaboration[pair]) {
              memberCollaboration[pair] = { name: pair, value: 0 }
            }
            memberCollaboration[pair].value += 1
          }
        }
      }
    })
    
    return {
      collaborationPercentage: totalDays > 0 ? (collaborationDays / totalDays) * 100 : 0,
      memberPairs: Object.values(memberCollaboration)
    }
  }
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
  
  return (
    <div className="space-y-6">
      {/* Top metrics cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex flex-col items-center">
            <Users className="h-8 w-8 text-primary mb-2" />
            <div className="text-2xl font-bold">{activeMembers}</div>
            <div className="text-xs text-muted-foreground text-center">Active Members</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col items-center">
            <Activity className="h-8 w-8 text-primary mb-2" />
            <div className="text-2xl font-bold">{activities.length}</div>
            <div className="text-xs text-muted-foreground text-center">Total Activities</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col items-center">
            <Clock className="h-8 w-8 text-primary mb-2" />
            <div className="text-2xl font-bold">{activeDays}</div>
            <div className="text-xs text-muted-foreground text-center">Active Days</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col items-center">
            <Network className="h-8 w-8 text-primary mb-2" />
            <div className="text-2xl font-bold">{(activityFrequency * 100).toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground text-center">Activity Frequency</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col items-center">
            <AlertCircle className="h-8 w-8 text-primary mb-2" />
            <div className="text-2xl font-bold">{blockerPercentage.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground text-center">Blockers</div>
          </div>
        </Card>
      </div>
      
      {/* Tabs for different metrics views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity-types">Activity Types</TabsTrigger>
          <TabsTrigger value="member-activity">Member Activity</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Activity Timeline */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>
                  Activities over time during the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {activities.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={activityTimeline()}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={formatDate}
                        />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={(value) => new Date(value).toLocaleDateString()}
                          formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="total" 
                          stroke="#8884d8" 
                          name="Total" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-medium">No Timeline Data</h3>
                        <p className="text-sm text-muted-foreground">
                          No activities found across the time period
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Daily Activity Pattern */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Patterns</CardTitle>
                <CardDescription>
                  Activity distribution by hour of day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {activities.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={dailyActivityPatterns()}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="hour"
                          tickFormatter={(hour) => `${hour}:00`}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [value, "Activities"]}
                          labelFormatter={(hour) => `${hour}:00 - ${hour+1}:00`}
                        />
                        <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-medium">No Pattern Data</h3>
                        <p className="text-sm text-muted-foreground">
                          No activity pattern data available
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Top Contributors */}
            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
                <CardDescription>
                  Team members with most activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {activities.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={topContributors()}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 50,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          tick={{ fontSize: 12 }} 
                        />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" name="Activities" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-medium">No Data</h3>
                        <p className="text-sm text-muted-foreground">
                          No contributors found for the selected period
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Activity Types Tab */}
        <TabsContent value="activity-types" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Activity Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Distribution</CardTitle>
                <CardDescription>
                  Breakdown of activities by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {activities.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={activityTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {activityTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-medium">No Data</h3>
                        <p className="text-sm text-muted-foreground">
                          No activities found for the selected period
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Activity Type Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Type Statistics</CardTitle>
                <CardDescription>
                  Detailed breakdown of activity types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full p-2 bg-green-500/10">
                            <GitCommit className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium mb-1">Commits</div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div 
                                className="h-full bg-green-600 rounded-full" 
                                style={{ width: `${activities.length > 0 ? (activityTypeData[0].value / activities.length) * 100 : 0}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-sm">{activityTypeData[0].value}</div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="rounded-full p-2 bg-blue-500/10">
                            <GitPullRequest className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium mb-1">Pull Requests</div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div 
                                className="h-full bg-blue-600 rounded-full" 
                                style={{ width: `${activities.length > 0 ? (activityTypeData[1].value / activities.length) * 100 : 0}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-sm">{activityTypeData[1].value}</div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="rounded-full p-2 bg-purple-500/10">
                            <MessagesSquare className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium mb-1">Messages</div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div 
                                className="h-full bg-purple-600 rounded-full" 
                                style={{ width: `${activities.length > 0 ? (activityTypeData[2].value / activities.length) * 100 : 0}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-sm">{activityTypeData[2].value}</div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="rounded-full p-2 bg-red-500/10">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium mb-1">Blockers</div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div 
                                className="h-full bg-red-600 rounded-full" 
                                style={{ width: `${activities.length > 0 ? (activityTypeData[3].value / activities.length) * 100 : 0}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-sm">{activityTypeData[3].value}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-[200px] items-center justify-center">
                      <div className="text-center">
                        <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mt-2">
                          No activity type data available
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Activity Over Time by Type */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Activity Types Over Time</CardTitle>
                <CardDescription>
                  Distribution of activity types across the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {activities.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={activityTimeline()}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={formatDate}
                        />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={(value) => new Date(value).toLocaleDateString()}
                          formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="commits" 
                          stroke="#22c55e" 
                          name="Commits" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="pull_requests" 
                          stroke="#3b82f6" 
                          name="Pull Requests" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="messages" 
                          stroke="#a855f7" 
                          name="Messages" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="blockers" 
                          stroke="#ef4444" 
                          name="Blockers" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-medium">No Timeline Data</h3>
                        <p className="text-sm text-muted-foreground">
                          No activities found for the selected period
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Member Activity Tab */}
        <TabsContent value="member-activity" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Member Activity Radar Chart */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Member Activity Analysis</CardTitle>
                <CardDescription>
                  Activity type breakdown by team member
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  {activities.length > 0 && memberActivityData().length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={150} data={memberActivityData()}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                        <Radar name="Commits" dataKey="commit" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                        <Radar name="Pull Requests" dataKey="pull_request" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                        <Radar name="Messages" dataKey="message" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} />
                        <Radar name="Blockers" dataKey="blocker" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <UserCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-medium">No Member Data</h3>
                        <p className="text-sm text-muted-foreground">
                          No member activity data available
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Individual Member Contributions */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Member Contributions</CardTitle>
                <CardDescription>
                  Breakdown of activities by team member
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activities.length > 0 && memberActivityData().length > 0 ? (
                    memberActivityData().map((member, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.total} activities</div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-600 rounded-full" 
                              style={{ width: `${member.total > 0 ? (member.commit / member.total) * 100 : 0}%` }}
                            />
                          </div>
                          <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 rounded-full" 
                              style={{ width: `${member.total > 0 ? (member.pull_request / member.total) * 100 : 0}%` }}
                            />
                          </div>
                          <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-600 rounded-full" 
                              style={{ width: `${member.total > 0 ? (member.message / member.total) * 100 : 0}%` }}
                            />
                          </div>
                          <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-600 rounded-full" 
                              style={{ width: `${member.total > 0 ? (member.blocker / member.total) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                          <div>Commits: {member.commit}</div>
                          <div>PRs: {member.pull_request}</div>
                          <div>Messages: {member.message}</div>
                          <div>Blockers: {member.blocker}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex h-[200px] items-center justify-center">
                      <div className="text-center">
                        <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mt-2">
                          No member contribution data available
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Collaboration Tab */}
        <TabsContent value="collaboration" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Collaboration Index */}
            <Card>
              <CardHeader>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Analysis of team collaboration patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activities.length > 0 ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative h-40 w-40">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-3xl font-bold">{collaborationData().collaborationPercentage.toFixed(0)}%</div>
                      </div>
                      <svg className="h-full w-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="10"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#8884d8"
                          strokeWidth="10"
                          strokeDasharray={`${collaborationData().collaborationPercentage * 2.83} 283`}
                          strokeDashoffset="0"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">Collaboration Index</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Days with multiple team members active
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[200px] items-center justify-center">
                    <div className="text-center">
                      <Network className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">
                        No collaboration data available
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Member Collaboration Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>Member Collaboration</CardTitle>
                <CardDescription>
                  Collaborative days between team members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {activities.length > 0 && collaborationData().memberPairs.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <Treemap
                        data={collaborationData().memberPairs}
                        dataKey="value"
                        aspectRatio={4 / 3}
                        stroke="#fff"
                        fill="#8884d8"
                      >
                        <Tooltip formatter={(value) => [`${value} days`, 'Collaborated']} />
                      </Treemap>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <Network className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-medium">No Collaboration Data</h3>
                        <p className="text-sm text-muted-foreground">
                          Not enough collaboration data to analyze
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
