import type { Activity } from "./types"

// Generate dates within the last 30 days
const getRandomDate = (daysAgo = 30) => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo))
  return date.toISOString()
}

// Mock activities data
export const MOCK_ACTIVITIES: Activity[] = [
  // User 1 activities
  {
    id: "activity-1",
    type: "commit",
    description: "Added new dashboard components",
    timestamp: getRandomDate(2),
    user: {
      id: "user-1",
      name: "John Doe",
    },
    metadata: {
      repository: "frontend",
      branch: "main",
      commitId: "abc123",
    },
  },
  {
    id: "activity-2",
    type: "pull_request",
    description: "Implemented user authentication flow",
    timestamp: getRandomDate(3),
    user: {
      id: "user-1",
      name: "John Doe",
    },
    metadata: {
      repository: "frontend",
      prNumber: "42",
      status: "open",
    },
  },
  {
    id: "activity-3",
    type: "message",
    description: "Updated team on project status",
    timestamp: getRandomDate(1),
    user: {
      id: "user-1",
      name: "John Doe",
    },
    metadata: {
      channel: "general",
    },
  },

  // User 2 activities
  {
    id: "activity-4",
    type: "commit",
    description: "Fixed API integration bugs",
    timestamp: getRandomDate(4),
    user: {
      id: "user-2",
      name: "Jane Smith",
    },
    metadata: {
      repository: "backend",
      branch: "fix/api-bugs",
      commitId: "def456",
    },
  },
  {
    id: "activity-5",
    type: "pull_request",
    description: "Added new API endpoints for user management",
    timestamp: getRandomDate(5),
    user: {
      id: "user-2",
      name: "Jane Smith",
    },
    metadata: {
      repository: "backend",
      prNumber: "37",
      status: "merged",
    },
  },
  {
    id: "activity-6",
    type: "blocker",
    description: "Blocked by missing design specs for user profile",
    timestamp: getRandomDate(2),
    user: {
      id: "user-2",
      name: "Jane Smith",
    },
    metadata: {
      status: "open",
      priority: "high",
    },
  },

  // User 3 activities
  {
    id: "activity-7",
    type: "commit",
    description: "Implemented database schema changes",
    timestamp: getRandomDate(6),
    user: {
      id: "user-3",
      name: "Bob Johnson",
    },
    metadata: {
      repository: "backend",
      branch: "feature/db-schema",
      commitId: "ghi789",
    },
  },
  {
    id: "activity-8",
    type: "message",
    description: "Shared documentation updates with the team",
    timestamp: getRandomDate(3),
    user: {
      id: "user-3",
      name: "Bob Johnson",
    },
    metadata: {
      channel: "docs",
    },
  },

  // User 4 activities
  {
    id: "activity-9",
    type: "commit",
    description: "Updated UI components for accessibility",
    timestamp: getRandomDate(7),
    user: {
      id: "user-4",
      name: "Alice Williams",
    },
    metadata: {
      repository: "frontend",
      branch: "feature/accessibility",
      commitId: "jkl012",
    },
  },
  {
    id: "activity-10",
    type: "pull_request",
    description: "Improved mobile responsiveness",
    timestamp: getRandomDate(8),
    user: {
      id: "user-4",
      name: "Alice Williams",
    },
    metadata: {
      repository: "frontend",
      prNumber: "45",
      status: "open",
    },
  },
  {
    id: "activity-11",
    type: "blocker",
    description: "Blocked by performance issues in production",
    timestamp: getRandomDate(4),
    user: {
      id: "user-4",
      name: "Alice Williams",
    },
    metadata: {
      status: "resolved",
      priority: "critical",
    },
  },

  // Additional activities for all users
  {
    id: "activity-12",
    type: "commit",
    description: "Refactored authentication service",
    timestamp: getRandomDate(9),
    user: {
      id: "user-1",
      name: "John Doe",
    },
    metadata: {
      repository: "backend",
      branch: "refactor/auth",
      commitId: "mno345",
    },
  },
  {
    id: "activity-13",
    type: "message",
    description: "Discussed API design changes",
    timestamp: getRandomDate(5),
    user: {
      id: "user-2",
      name: "Jane Smith",
    },
    metadata: {
      channel: "api-design",
    },
  },
  {
    id: "activity-14",
    type: "pull_request",
    description: "Added unit tests for core components",
    timestamp: getRandomDate(10),
    user: {
      id: "user-3",
      name: "Bob Johnson",
    },
    metadata: {
      repository: "frontend",
      prNumber: "48",
      status: "merged",
    },
  },
  {
    id: "activity-15",
    type: "commit",
    description: "Fixed critical security vulnerability",
    timestamp: getRandomDate(6),
    user: {
      id: "user-4",
      name: "Alice Williams",
    },
    metadata: {
      repository: "backend",
      branch: "hotfix/security",
      commitId: "pqr678",
    },
  },
  {
    id: "activity-16",
    type: "message",
    description: "Shared weekly progress update",
    timestamp: getRandomDate(1),
    user: {
      id: "user-1",
      name: "John Doe",
    },
    metadata: {
      channel: "general",
    },
  },
  {
    id: "activity-17",
    type: "blocker",
    description: "Blocked by third-party API outage",
    timestamp: getRandomDate(2),
    user: {
      id: "user-3",
      name: "Bob Johnson",
    },
    metadata: {
      status: "resolved",
      priority: "high",
    },
  },
  {
    id: "activity-18",
    type: "commit",
    description: "Optimized database queries for performance",
    timestamp: getRandomDate(11),
    user: {
      id: "user-2",
      name: "Jane Smith",
    },
    metadata: {
      repository: "backend",
      branch: "optimize/db-queries",
      commitId: "stu901",
    },
  },
  {
    id: "activity-19",
    type: "pull_request",
    description: "Implemented new feature: team analytics",
    timestamp: getRandomDate(12),
    user: {
      id: "user-1",
      name: "John Doe",
    },
    metadata: {
      repository: "frontend",
      prNumber: "52",
      status: "open",
    },
  },
  {
    id: "activity-20",
    type: "message",
    description: "Coordinated deployment schedule with team",
    timestamp: getRandomDate(3),
    user: {
      id: "user-4",
      name: "Alice Williams",
    },
    metadata: {
      channel: "deployments",
    },
  },
]

// Generate more activities for the past 30 days
for (let i = 0; i < 80; i++) {
  const userId = `user-${Math.floor(Math.random() * 4) + 1}`
  const userName = {
    "user-1": "John Doe",
    "user-2": "Jane Smith",
    "user-3": "Bob Johnson",
    "user-4": "Alice Williams",
  }[userId]

  const activityTypes = ["commit", "pull_request", "message", "blocker"]
  const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)]

  let description = ""
  switch (activityType) {
    case "commit":
      description = `${["Added", "Updated", "Fixed", "Refactored", "Removed"][Math.floor(Math.random() * 5)]} ${["component", "feature", "bug", "documentation", "test"][Math.floor(Math.random() * 5)]}`
      break
    case "pull_request":
      description = `${["Created", "Updated", "Reviewed", "Merged", "Closed"][Math.floor(Math.random() * 5)]} pull request for ${["new feature", "bug fix", "enhancement", "refactoring", "performance improvement"][Math.floor(Math.random() * 5)]}`
      break
    case "message":
      description = `${["Shared", "Discussed", "Asked about", "Responded to", "Updated team on"][Math.floor(Math.random() * 5)]} ${["project status", "technical issue", "design feedback", "deployment plan", "meeting notes"][Math.floor(Math.random() * 5)]}`
      break
    case "blocker":
      description = `Blocked by ${["API issue", "missing requirements", "dependency update", "technical debt", "resource constraint"][Math.floor(Math.random() * 5)]}`
      break
  }

  MOCK_ACTIVITIES.push({
    id: `activity-${20 + i + 1}`,
    type: activityType as any,
    description,
    timestamp: getRandomDate(30),
    user: {
      id: userId,
      name: userName,
    },
    metadata: {},
  })
}
