"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { teamService } from "@/lib/team-service"
import type { Team } from "@/lib/types"

interface TeamSelectorProps {
  team?: Team | null
  onTeamChange?: (team: Team) => void
}

export function TeamSelector({ team, onTeamChange }: TeamSelectorProps) {
  const [open, setOpen] = useState(false)
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true)
      try {
        const userTeams = await teamService.getUserTeams()
        setTeams(userTeams)
      } catch (error) {
        console.error("Error fetching teams:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeams()
  }, [])

  const handleTeamSelect = (selectedTeam: Team) => {
    setOpen(false)
    if (onTeamChange) {
      onTeamChange(selectedTeam)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={isLoading}
        >
          {team ? (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="truncate">{team.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-muted-foreground">Select team</span>
            </div>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search teams..." />
          <CommandList>
            <CommandEmpty>No teams found.</CommandEmpty>
            <CommandGroup>
              {teams.map((t) => (
                <CommandItem
                  key={t.id}
                  value={t.name}
                  onSelect={() => handleTeamSelect(t)}
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{t.name}</span>
                  </div>
                  {team?.id === t.id && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
