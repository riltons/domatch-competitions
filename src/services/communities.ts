import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'
import { whatsappService } from './whatsapp'

type Community = Database['public']['Tables']['communities']['Row']
type CommunityInsert = Database['public']['Tables']['communities']['Insert']
type CommunityUpdate = Database['public']['Tables']['communities']['Update']
type Player = Database['public']['Tables']['players']['Row']

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
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError
      if (!session?.user) throw new Error('Usuário não autenticado')

      const { data: community, error } = await supabase
        .from('communities')
        .insert({ ...input, created_by: session.user.id })
        .select()
        .single();

      if (error) throw error;
      if (!community) throw new Error('Falha ao criar comunidade');

      // Criar grupo no WhatsApp
      try {
        const whatsappGroup = await whatsappService.createCommunityGroup(community);
        
        // Atualizar comunidade com dados do WhatsApp
        const { data: updatedCommunity, error: updateError } = await supabase
          .from('communities')
          .update({
            whatsapp_group_id: whatsappGroup.id,
            whatsapp_group_invite_link: whatsappGroup.inviteLink,
            whatsapp_group_qr_code: whatsappGroup.qrCode
          })
          .eq('id', community.id)
          .select()
          .single();

        if (updateError) throw updateError;
        if (!updatedCommunity) throw new Error('Falha ao atualizar comunidade');

        return updatedCommunity;
      } catch (whatsappError) {
        console.error('Erro ao criar grupo no WhatsApp:', whatsappError);
        // Retorna a comunidade mesmo sem o grupo do WhatsApp
        return community;
      }
    } catch (error) {
      console.error('Erro ao criar comunidade:', error);
      throw error;
    }
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

  async addPlayerToCommunity(communityId: string, playerId: string) {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError
      if (!session?.user) throw new Error('Usuário não autenticado')

      // Buscar dados da comunidade e do jogador
      const [{ data: community }, { data: player }] = await Promise.all([
        supabase
          .from('communities')
          .select('*')
          .eq('id', communityId)
          .single(),
        supabase
          .from('players')
          .select('*')
          .eq('id', playerId)
          .single()
      ]);

      if (!community || !player) {
        throw new Error('Comunidade ou jogador não encontrado');
      }

      // Adicionar jogador à comunidade
      const { error } = await supabase
        .from('community_players')
        .insert({
          community_id: communityId,
          player_id: playerId,
          invitation_status: 'pending',
          player_phone: player.phone,
          created_by: session.user.id
        });

      if (error) {
        if (error.code === '23505') {
          throw new Error('Este jogador já está na comunidade')
        }
        throw error
      }

      // Enviar convite via WhatsApp
      try {
        await whatsappService.sendPlayerInvite(community, player);
      } catch (whatsappError) {
        console.error('Erro ao enviar convite via WhatsApp:', whatsappError);
        // Continua mesmo sem enviar o convite via WhatsApp
      }
    } catch (error) {
      console.error('Erro ao adicionar jogador:', error);
      throw error;
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
}
