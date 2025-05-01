export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          created_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          invite_code: string
          created_at: string
          owner_id: string
        }
        Insert: {
          id?: string
          name: string
          invite_code: string
          created_at?: string
          owner_id: string
        }
        Update: {
          id?: string
          name?: string
          invite_code?: string
          created_at?: string
          owner_id?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role: string
          joined_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          type: string
          description: string
          timestamp: string
          user_id: string
          team_id: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          type: string
          description: string
          timestamp?: string
          user_id: string
          team_id: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          type?: string
          description?: string
          timestamp?: string
          user_id?: string
          team_id?: string
          metadata?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 