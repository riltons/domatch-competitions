export interface Player {
  id: string
  name: string
  phone: string
  community_id: string
  user_id: string
  created_at: string
}

export interface CreatePlayerInput {
  name: string
  phone: string
  community_id: string
}
