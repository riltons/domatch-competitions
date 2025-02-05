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
      communities: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          owner_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          owner_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          owner_id?: string
        }
      }
      community_members: {
        Row: {
          id: string
          created_at: string
          community_id: string
          player_id: string
          role: 'admin' | 'member'
        }
        Insert: {
          id?: string
          created_at?: string
          community_id: string
          player_id: string
          role?: 'admin' | 'member'
        }
        Update: {
          id?: string
          created_at?: string
          community_id?: string
          player_id?: string
          role?: 'admin' | 'member'
        }
      }
      players: {
        Row: {
          id: string
          created_at: string
          name: string
          nickname: string | null
          phone: string | null
          user_id: string | null
          avatar_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          nickname?: string | null
          phone?: string | null
          user_id?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          nickname?: string | null
          phone?: string | null
          user_id?: string | null
          avatar_url?: string | null
        }
      }
      competitions: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          community_id: string
          start_date: string
          end_date: string | null
          status: 'draft' | 'active' | 'finished'
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          community_id: string
          start_date: string
          end_date?: string | null
          status?: 'draft' | 'active' | 'finished'
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          community_id?: string
          start_date?: string
          end_date?: string | null
          status?: 'draft' | 'active' | 'finished'
        }
      }
      games: {
        Row: {
          id: string
          created_at: string
          competition_id: string
          team1_player1_id: string
          team1_player2_id: string
          team2_player1_id: string
          team2_player2_id: string
          team1_score: number
          team2_score: number
          status: 'scheduled' | 'in_progress' | 'finished'
          date: string
        }
        Insert: {
          id?: string
          created_at?: string
          competition_id: string
          team1_player1_id: string
          team1_player2_id: string
          team2_player1_id: string
          team2_player2_id: string
          team1_score?: number
          team2_score?: number
          status?: 'scheduled' | 'in_progress' | 'finished'
          date: string
        }
        Update: {
          id?: string
          created_at?: string
          competition_id?: string
          team1_player1_id?: string
          team1_player2_id?: string
          team2_player1_id?: string
          team2_player2_id?: string
          team1_score?: number
          team2_score?: number
          status?: 'scheduled' | 'in_progress' | 'finished'
          date?: string
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