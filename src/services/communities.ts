import { supabase } from '@/lib/supabase'
import type { Community, Player } from '@/types'

export const communitiesService = {
  async getCommunities() {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('owner_id', session.user.id)
      .order('name')

    if (error) throw error
    return data as Community[]
  },

  async createCommunity(input: { name: string; description?: string }) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('communities')
      .insert({
        name: input.name,
        description: input.description,
        owner_id: session.user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data as Community
  },

  async updateCommunity(id: string, input: { name?: string; description?: string }) {
    const { data, error } = await supabase
      .from('communities')
      .update(input)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Community
  },

  async getCommunity(id: string) {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Community
  },

  async deleteCommunity(id: string) {
    const { error } = await supabase
      .from('communities')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async addPlayerToCommunity(communityId: string, playerId: string) {
    const { error } = await supabase
      .from('community_members')
      .insert({
        community_id: communityId,
        player_id: playerId,
        role: 'member',
      })

    if (error) throw error
  },

  async removePlayerFromCommunity(communityId: string, playerId: string) {
    const { error } = await supabase
      .from('community_members')
      .delete()
      .eq('community_id', communityId)
      .eq('player_id', playerId)

    if (error) throw error
  },

  async getCommunityPlayers(communityId: string) {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('community_id', communityId)

    if (error) throw error
    return data as Player[]
  },
}
