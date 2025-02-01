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
          name: string
          created_at: string
          admin_id: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          admin_id: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          admin_id?: string
        }
      }
      competitions: {
        Row: {
          id: string
          name: string
          start_date: string
          end_date: string
          community_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          start_date: string
          end_date: string
          community_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          start_date?: string
          end_date?: string
          community_id?: string
          created_at?: string
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
