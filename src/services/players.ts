import { supabase } from '@/lib/supabase'
import { Player, CreatePlayerInput } from '@/types/player'

export const playersService = {
  async getAllPlayers(): Promise<Player[]> {
    const { data, error } = await supabase
      .from('players')
      .select('*, communities(*)')
      .order('name')

    if (error) throw error
    return data
  },

  async getPlayers(communityId: string): Promise<Player[]> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('community_id', communityId)
      .order('name')

    if (error) throw error
    return data
  },

  async createPlayer(input: CreatePlayerInput): Promise<Player> {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const { data, error } = await supabase
      .from('players')
      .insert([{ ...input, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updatePlayer(id: string, input: Partial<CreatePlayerInput>): Promise<Player> {
    const { data, error } = await supabase
      .from('players')
      .update(input)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deletePlayer(id: string): Promise<void> {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
