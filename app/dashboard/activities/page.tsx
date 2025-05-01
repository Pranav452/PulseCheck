"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { ActivityFeed } from "@/components/activity-feed"
import { DateRangePicker } from "@/components/date-range-picker"
import { TeamSelector } from "@/components/team-selector"
import { activityService } from "@/lib/activity-service"
import { teamService } from "@/lib/team-service"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, BarChart2, AlertCircle, GitCommit, GitPullRequest, MessagesSquare, Users, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Activity, Team, TeamMember } from "@/lib/types"
import type { DateRange } from "react-day-picker"
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
  Line
} from "recharts"

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [team, setTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activityType, setActivityType] = useState<string>("all")
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  
  // For new activity form
  const [newActivityType, setNewActivityType] = useState<"commit" | "pull_request" | "message" | "blocker">("message")
  const [newActivityDescription, setNewActivityDescription] = useState("")
  const [newActivityMetadata, setNewActivityMetadata] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const currentTeam = await teamService.getCurrentTeam()
        setTeam(currentTeam)

        // Only fetch activities if both dates are defined
        if (dateRange.from && dateRange.to) {
          const teamActivities = await activityService.getTeamActivities(
            currentTeam.id, 
            dateRange.from, 
            dateRange.to
          )
          
          setActivities(teamActivities)
        }
      } catch (error) {
        console.error("Error fetching activities:", error)
        toast({
          title: "Error",
          description: "Failed to load activities. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range)
  }

  const handleTeamChange = async (newTeam: Team) => {
    setTeam(newTeam)
    setIsLoading(true)

    try {
      if (dateRange.from && dateRange.to) {
        const teamActivities = await activityService.getTeamActivities(
          newTeam.id, 
          dateRange.from, 
          dateRange.to
        )
        setActivities(teamActivities)
      }
    } catch (error) {
      console.error("Error fetching team activities:", error)
      toast({
        title: "Error",
        description: "Failed to load team activities. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddActivity = async () => {
    if (!team) return
    if (!newActivityDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter an activity description",
        variant: "destructive",
      })
      return
    }

    try {
      const metadata = newActivityMetadata.trim() ? 
        JSON.parse(newActivityMetadata) : undefined

      const activity = await activityService.addActivity({
        type: newActivityType,
        description: newActivityDescription,
        teamId: team.id,
        metadata
      })

      setActivities([activity, ...activities])
      setNewActivityDescription("")
      setNewActivityMetadata("")
      
      toast({
        title: "Success",
        description: "Activity added successfully",
      })
    } catch (error) {
      console.error("Error adding activity:", error)
      toast({
        title: "Error",
        description: "Failed to add activity. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateSampleData = async () => {
    if (!team) return
    setIsLoading(true)

    try {
      await activityService.generateSampleData(team.id)
      
      if (dateRange.from && dateRange.to) {
        const teamActivities = await activityService.getTeamActivities(
          team.id, 
          dateRange.from, 
          dateRange.to
        )
        setActivities(teamActivities)
      }
      
      toast({
        title: "Success",
        description: "Sample data generated successfully",
      })
    } catch (error) {
      console.error("Error generating sample data:", error)
      toast({
        title: "Error",
        description: "Failed to generate sample data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredActivities = activityType === "all" 
    ? activities 
    : activities.filter(activity => activity.type === activityType)

  // Prepare data for charts
  const getActivityCountsByType = () => {
    const counts = {
      commit: 0,
      pull_request: 0,
      message: 0,
      blocker: 0
    }
    
    activities.forEach(activity => {
      counts[activity.type]++
    })
    
    return [
      { name: "Commits", value: counts.commit, color: "#22c55e" },
      { name: "Pull Requests", value: counts.pull_request, color: "#3b82f6" },
      { name: "Messages", value: counts.message, color: "#a855f7" },
      { name: "Blockers", value: counts.blocker, color: "#ef4444" }
    ]
  }
  
  const getActivityCountsByDay = () => {
    const counts = {}
    
    if (!dateRange.from || !dateRange.to) return []
    
    // Create all dates in range
    const startDate = new Date(dateRange.from)
    const endDate = new Date(dateRange.to)
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
  
  const getTopContributors = () => {
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
  
  const activityCountsByType = getActivityCountsByType()
  const activityCountsByDay = getActivityCountsByDay()
  const topContributors = getTopContributors()
  
  const COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#ef4444']
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
          <p className="text-muted-foreground">Track and manage team activities</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Activity</DialogTitle>
                <DialogDescription>
                  Record a new activity for your team
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="activity-type">Activity Type</Label>
                  <Select 
                    value={newActivityType} 
                    onValueChange={(value) => setNewActivityType(value as any)}
                  >
                    <SelectTrigger id="activity-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commit">
                        <div className="flex items-center">
                          <GitCommit className="mr-2 h-4 w-4" />
                          Commit
                        </div>
                      </SelectItem>
                      <SelectItem value="pull_request">
                        <div className="flex items-center">
                          <GitPullRequest className="mr-2 h-4 w-4" />
                          Pull Request
                        </div>
                      </SelectItem>
                      <SelectItem value="message">
                        <div className="flex items-center">
                          <MessagesSquare className="mr-2 h-4 w-4" />
                          Message
                        </div>
                      </SelectItem>
                      <SelectItem value="blocker">
                        <div className="flex items-center">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Blocker
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="activity-description">Description</Label>
                  <Textarea 
                    id="activity-description"
                    placeholder="Enter activity description"
                    value={newActivityDescription}
                    onChange={(e) => setNewActivityDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="activity-metadata">
                    Metadata (Optional JSON)
                  </Label>
                  <Textarea 
                    id="activity-metadata"
                    placeholder='{"key": "value"}'
                    value={newActivityMetadata}
                    onChange={(e) => setNewActivityMetadata(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleGenerateSampleData}>
                  Generate Sample Data
                </Button>
                <Button onClick={handleAddActivity}>Add Activity</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        <Card className="md:w-64 flex-shrink-0">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <DateRangePicker 
                dateRange={dateRange} 
                onDateRangeChange={handleDateRangeChange} 
              />
            </div>
            <div className="space-y-2">
              <Label>Team</Label>
              <TeamSelector team={team} />
            </div>
            <div className="space-y-2">
              <Label>Activity Type</Label>
              <Select 
                value={activityType} 
                onValueChange={setActivityType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="commit">Commits</SelectItem>
                  <SelectItem value="pull_request">Pull Requests</SelectItem>
                  <SelectItem value="message">Messages</SelectItem>
                  <SelectItem value="blocker">Blockers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1 w-full">
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="feed">Activity Feed</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="feed">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Feed</CardTitle>
                  <CardDescription>
                    {filteredActivities.length} activities in selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityFeed 
                    activities={filteredActivities} 
                    isLoading={isLoading} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of activities by type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      {activityCountsByType.some(item => item.value > 0) ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={activityCountsByType}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {activityCountsByType.map((entry, index) => (
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
                
                <Card>
                  <CardHeader>
                    <CardTitle>Top Contributors</CardTitle>
                    <CardDescription>
                      Team members with most activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      {topContributors.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={topContributors}
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
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Activity Timeline</CardTitle>
                    <CardDescription>
                      Activities over time during the selected period
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      {activityCountsByDay.length > 0 && activities.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={activityCountsByDay}
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
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Daily Activity Breakdown</CardTitle>
                    <CardDescription>
                      Activity counts by type for each day
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      {activityCountsByDay.length > 0 && activities.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={activityCountsByDay}
                            margin={{
                              top: 20,
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
                            <Bar dataKey="commits" fill="#22c55e" name="Commits" />
                            <Bar dataKey="pull_requests" fill="#3b82f6" name="Pull Requests" />
                            <Bar dataKey="messages" fill="#a855f7" name="Messages" />
                            <Bar dataKey="blockers" fill="#ef4444" name="Blockers" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <div className="text-center">
                            <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-2 text-lg font-medium">No Activity Data</h3>
                            <p className="text-sm text-muted-foreground">
                              No daily activity data available for the selected period
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
      </div>
    </div>
  )
} 