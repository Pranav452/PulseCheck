"use client"

import { format, formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GitCommit, GitPullRequest, MessagesSquare, AlertCircle } from "lucide-react"
import type { Activity } from "@/lib/types"

interface ActivityFeedProps {
  activities: Activity[]
  isLoading?: boolean
}

export function ActivityFeed({ activities, isLoading = false }: ActivityFeedProps) {
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "commit":
        return <GitCommit className="h-4 w-4" />
      case "pull_request":
        return <GitPullRequest className="h-4 w-4" />
      case "message":
        return <MessagesSquare className="h-4 w-4" />
      case "blocker":
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getActivityTypeClass = (type: Activity["type"]) => {
    switch (type) {
      case "commit":
        return "bg-green-500/10 text-green-600"
      case "pull_request":
        return "bg-blue-500/10 text-blue-600"
      case "message":
        return "bg-purple-500/10 text-purple-600"
      case "blocker":
        return "bg-red-500/10 text-red-600"
      default:
        return "bg-gray-500/10 text-gray-600"
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    const parts = name.split(" ")
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!activities.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3">
          <MessagesSquare className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">No Activities</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          There are no activities yet for the selected time period. Try adjusting the filters or add a new activity.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={activity.user.avatarUrl} alt={activity.user.name} />
            <AvatarFallback>{getInitials(activity.user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{activity.user.name}</span>
              <span className="text-muted-foreground">·</span>
              <span 
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getActivityTypeClass(activity.type)}`}
              >
                <span className="mr-1">{getActivityIcon(activity.type)}</span>
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1).replace("_", " ")}
              </span>
              <span className="text-muted-foreground text-xs ml-auto">
                <span className="hidden md:inline" title={format(new Date(activity.timestamp), "PPpp")}>
                  {format(new Date(activity.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </span>
                <span className="md:hidden" title={format(new Date(activity.timestamp), "PPpp")}>
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
            {activity.metadata && (
              <div className="mt-2 rounded bg-muted p-2 text-xs">
                <pre className="overflow-auto">{JSON.stringify(activity.metadata, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
