export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export interface Team {
  id: string
  name: string
  inviteCode: string
  createdAt: string
  ownerId: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: "Owner" | "Admin" | "Member"
  avatarUrl?: string
  joinedAt: string
}

export interface Activity {
  id: string
  type: "commit" | "pull_request" | "message" | "blocker"
  description: string
  timestamp: string
  user: {
    id: string
    name: string
    avatarUrl?: string
  }
  metadata?: Record<string, any>
}
