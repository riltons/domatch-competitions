export interface Community {
  id: string
  name: string
  description: string | null
  user_id: string
  created_at: string
  updated_at: string
}

export type CreateCommunityInput = Pick<Community, 'name' | 'description'>
