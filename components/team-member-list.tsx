import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { TeamMember } from "@/lib/types"

interface TeamMemberListProps {
  members: TeamMember[]
}

export function TeamMemberList({ members }: TeamMemberListProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No team members yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div key={member.id} className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={member.avatarUrl || `/placeholder.svg?height=32&width=32`} alt={member.name} />
            <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{member.name}</p>
            <p className="text-xs text-muted-foreground truncate">{member.role}</p>
          </div>
          <div className="h-2 w-2 rounded-full bg-green-500" title="Online" />
        </div>
      ))}
    </div>
  )
}
