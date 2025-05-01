"use client"

import { useMemo } from "react"
import type { Activity } from "@/lib/types"
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"

interface ActivityChartProps {
  activities: Activity[]
}

export function ActivityChart({ activities }: ActivityChartProps) {
  const chartData = useMemo(() => {
    // Group activities by date
    const groupedByDate = activities.reduce(
      (acc, activity) => {
        const date = new Date(activity.timestamp).toLocaleDateString()

        if (!acc[date]) {
          acc[date] = {
            date,
            commits: 0,
            pullRequests: 0,
            messages: 0,
            blockers: 0,
          }
        }

        switch (activity.type) {
          case "commit":
            acc[date].commits += 1
            break
          case "pull_request":
            acc[date].pullRequests += 1
            break
          case "message":
            acc[date].messages += 1
            break
          case "blocker":
            acc[date].blockers += 1
            break
        }

        return acc
      },
      {} as Record<string, { date: string; commits: number; pullRequests: number; messages: number; blockers: number }>,
    )

    // Convert to array and sort by date
    return Object.values(groupedByDate).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [activities])

  if (chartData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center border rounded-md">
        <p className="text-muted-foreground">No activity data available</p>
      </div>
    )
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="commits" name="Commits" fill="#8884d8" />
          <Bar dataKey="pullRequests" name="Pull Requests" fill="#82ca9d" />
          <Line type="monotone" dataKey="messages" name="Messages" stroke="#ffc658" />
          <Line type="monotone" dataKey="blockers" name="Blockers" stroke="#ff8042" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
