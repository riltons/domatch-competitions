import { Database } from './supabase'

export type Tables = Database['public']['Tables']

export type Player = Tables['players']['Row']
export type Community = Tables['communities']['Row']
export type CommunityMember = Tables['community_members']['Row']
export type Competition = Tables['competitions']['Row']
export type Game = Tables['games']['Row']

export type CreateCommunityDTO = {
  name: string
  description?: string
}

export type CreateCompetitionDTO = {
  name: string
  startDate: Date
  endDate?: Date
  communityId: string
}

export type UpdateCommunityDTO = {
  id: string
  name?: string
  description?: string
}

export type UpdateCompetitionDTO = {
  id: string
  name?: string
  startDate?: Date
  endDate?: Date
  status?: 'draft' | 'active' | 'finished'
}

export type CreateGameDTO = {
  competitionId: string
  team1Player1Id: string
  team1Player2Id: string
  team2Player1Id: string
  team2Player2Id: string
  date: Date
}
