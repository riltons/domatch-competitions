import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'

type Community = Database['public']['Tables']['communities']['Row']
type CommunityInsert = Database['public']['Tables']['communities']['Insert']
type CommunityUpdate = Database['public']['Tables']['communities']['Update']

export const communitiesService = {
  async getCommunities() {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .or(`created_by.eq.${session.user.id},organizer_id.eq.${session.user.id}`)
      .order('name')

    if (error) throw error
    return data
  },

  async createCommunity(input: Omit<CommunityInsert, 'created_by'>) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('communities')
      .insert({ ...input, created_by: session.user.id })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateCommunity(id: string, input: CommunityUpdate) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('communities')
      .update(input)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getCommunity(id: string) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async deleteCommunity(id: string) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('Usuário não autenticado')

    const { error } = await supabase
      .from('communities')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getCommunityPlayers(communityId: string) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('community_players')
      .select(`
        player:players (
          id,
          name,
          nickname
        )
      `)
      .eq('community_id', communityId)

    if (error) throw error
    return data.map((item) => item.player)
  },

  async addPlayerToCommunity(communityId: string, playerId: string) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('Usuário não autenticado')

    const { error } = await supabase
      .from('community_players')
      .insert({
        community_id: communityId,
        player_id: playerId,
        created_by: session.user.id
      })

    if (error) {
      if (error.code === '23505') {
        throw new Error('Este jogador já está na comunidade')
      }
      throw error
    }
  },

  async removePlayerFromCommunity(communityId: string, playerId: string) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('Usuário não autenticado')

    const { error } = await supabase
      .from('community_players')
      .delete()
      .eq('community_id', communityId)
      .eq('player_id', playerId)

    if (error) throw error
  },
}
