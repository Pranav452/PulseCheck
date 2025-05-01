// Mock activity service
import type { Activity } from "./types"
import { MOCK_ACTIVITIES } from "./mock-data"
import { supabase } from "./supabase"
import { authService } from "./auth-service"

export const activityService = {
  // Get team activities
  async getTeamActivities(teamId: string, startDate: Date, endDate: Date): Promise<Activity[]> {
    const { data, error } = await supabase
      .from("activities")
      .select(`
        id,
        type,
        description,
        timestamp,
        metadata,
        user_id,
        users:user_id (
          id,
          name,
          avatar_url
        )
      `)
      .eq("team_id", teamId)
      .gte("timestamp", startDate.toISOString())
      .lte("timestamp", endDate.toISOString())
      .order("timestamp", { ascending: false })

    if (error) throw error

    // Transform data to match the Activity type
    return data.map((item) => ({
      id: item.id,
      type: item.type as any,
      description: item.description,
      timestamp: item.timestamp,
      user: {
        id: item.users.id,
        name: item.users.name,
        avatarUrl: item.users.avatar_url || undefined,
      },
      metadata: item.metadata,
    }))
  },

  // Get user activities
  async getUserActivities(userId: string, startDate: Date, endDate: Date): Promise<Activity[]> {
    const { data, error } = await supabase
      .from("activities")
      .select(`
        id,
        type,
        description,
        timestamp,
        metadata,
        team_id,
        users:user_id (
          id,
          name,
          avatar_url
        )
      `)
      .eq("user_id", userId)
      .gte("timestamp", startDate.toISOString())
      .lte("timestamp", endDate.toISOString())
      .order("timestamp", { ascending: false })

    if (error) throw error

    return data.map((item) => ({
      id: item.id,
      type: item.type as any,
      description: item.description,
      timestamp: item.timestamp,
      user: {
        id: item.users.id,
        name: item.users.name,
        avatarUrl: item.users.avatar_url || undefined,
      },
      metadata: item.metadata,
    }))
  },

  // Add a new activity
  async addActivity(activity: {
    type: "commit" | "pull_request" | "message" | "blocker"
    description: string
    teamId: string
    metadata?: Record<string, any>
  }): Promise<Activity> {
    const currentUser = await authService.getCurrentUser()
    if (!currentUser) throw new Error("User not authenticated")

    const { data, error } = await supabase
      .from("activities")
      .insert({
        type: activity.type,
        description: activity.description,
        team_id: activity.teamId,
        user_id: currentUser.id,
        metadata: activity.metadata || null,
      })
      .select(`
        id, 
        type, 
        description, 
        timestamp, 
        metadata
      `)
      .single()

    if (error) throw error

    return {
      id: data.id,
      type: data.type as any,
      description: data.description,
      timestamp: data.timestamp,
      user: {
        id: currentUser.id,
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl,
      },
      metadata: data.metadata,
    }
  },

  // Generate sample activity data for a team
  async generateSampleData(teamId: string): Promise<void> {
    const currentUser = await authService.getCurrentUser()
    if (!currentUser) throw new Error("User not authenticated")

    const { data: members, error: memberError } = await supabase
      .from("team_members")
      .select("user_id")
      .eq("team_id", teamId)

    if (memberError) throw memberError
    
    const userIds = members.map(m => m.user_id)
    
    // Activity types and templates
    const activityTypes = ["commit", "pull_request", "message", "blocker"]
    const activityTemplates = {
      commit: [
        "Add new feature",
        "Fix bug in authentication",
        "Update dependencies",
        "Refactor code for better performance",
        "Implement UI improvements"
      ],
      pull_request: [
        "Merge feature branch",
        "Add new component",
        "Fix styling issues",
        "Update API endpoints",
        "Implement user feedback"
      ],
      message: [
        "Discussed project timeline",
        "Asked for help with a bug",
        "Shared resources for new feature",
        "Provided feedback on design",
        "Updated team on progress"
      ],
      blocker: [
        "API integration issue",
        "Design inconsistency",
        "Performance problem",
        "Dependencies conflict",
        "Testing environment error"
      ]
    }
    
    // Generate activities for the past 30 days
    const now = new Date()
    const activities = []
    
    for (let i = 0; i < 100; i++) {
      const randomDays = Math.floor(Math.random() * 30)
      const timestamp = new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000)
      const randomHours = Math.floor(Math.random() * 24)
      const randomMinutes = Math.floor(Math.random() * 60)
      timestamp.setHours(randomHours, randomMinutes)
      
      const type = activityTypes[Math.floor(Math.random() * activityTypes.length)]
      const templates = activityTemplates[type as keyof typeof activityTemplates]
      const description = templates[Math.floor(Math.random() * templates.length)]
      const userId = userIds[Math.floor(Math.random() * userIds.length)]
      
      activities.push({
        type,
        description,
        team_id: teamId,
        user_id: userId,
        timestamp: timestamp.toISOString(),
      })
    }
    
    // Insert activities in batches
    const batchSize = 20
    for (let i = 0; i < activities.length; i += batchSize) {
      const batch = activities.slice(i, i + batchSize)
      const { error } = await supabase.from("activities").insert(batch)
      if (error) throw error
    }
  },
}
