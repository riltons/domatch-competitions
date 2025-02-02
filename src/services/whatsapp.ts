import { Community, Player } from '../types/supabase';

const WHATSAPP_API_URL = import.meta.env.VITE_WHATSAPP_API_URL || 'http://localhost:8080';
const WHATSAPP_API_KEY = import.meta.env.VITE_WHATSAPP_API_KEY;

interface CreateGroupResponse {
  id: string;
  inviteLink?: string;
  qrCode?: string;
}

interface SendInviteResponse {
  messageId: string;
  status: 'sent' | 'failed';
}

export const whatsappService = {
  async createCommunityGroup(community: Community): Promise<CreateGroupResponse> {
    try {
      const response = await fetch(`${WHATSAPP_API_URL}/group/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': WHATSAPP_API_KEY
        },
        body: JSON.stringify({
          name: community.name,
          participants: [community.admin_phone]
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao criar grupo no WhatsApp');
      }

      const data = await response.json();
      return {
        id: data.groupId,
        inviteLink: data.inviteLink,
        qrCode: data.qrCode
      };
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      throw error;
    }
  },

  async sendPlayerInvite(community: Community, player: Player): Promise<SendInviteResponse> {
    try {
      if (!community.whatsapp_group_invite_link) {
        throw new Error('Link de convite do grupo não disponível');
      }

      const response = await fetch(`${WHATSAPP_API_URL}/message/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': WHATSAPP_API_KEY
        },
        body: JSON.stringify({
          number: player.phone,
          message: `Olá! Você foi convidado para participar da comunidade "${community.name}" no Domino Competitions.\n\nClique no link abaixo para entrar no grupo do WhatsApp:\n${community.whatsapp_group_invite_link}`
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar convite');
      }

      const data = await response.json();
      return {
        messageId: data.messageId,
        status: data.success ? 'sent' : 'failed'
      };
    } catch (error) {
      console.error('Erro ao enviar convite:', error);
      throw error;
    }
  }
};
