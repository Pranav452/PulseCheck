"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { Pencil, Check, Loader2 } from "lucide-react"
import type { User } from "@/lib/types"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [name, setName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  
  useEffect(() => {
    if (user) {
      setName(user.name)
      setAvatarUrl(user.avatarUrl || "")
    }
  }, [user])

  const handleUpdateProfile = async () => {
    if (!user) return
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)
    
    try {
      // Update the user in the database
      const { error } = await supabase
        .from("users")
        .update({
          name,
          avatar_url: avatarUrl || null,
        })
        .eq("id", user.id)

      if (error) throw error
      
      // Refresh the page to get the updated user data
      window.location.reload()
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    const parts = name.split(" ")
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start sm:justify-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback className="text-xl">{getInitials(name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar-url">Avatar URL (optional)</Label>
                      <Input 
                        id="avatar-url" 
                        value={avatarUrl} 
                        onChange={(e) => setAvatarUrl(e.target.value)} 
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                  {isUpdating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your account details and membership
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">User ID</Label>
                <p className="font-medium">{user.id}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Joined</Label>
                <p className="font-medium">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Account Type</Label>
                <p className="font-medium">Standard</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 