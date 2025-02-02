import { Community, Player } from '../types/supabase';

const EVOLUTION_API_URL = import.meta.env.VITE_EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY;
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook';

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
      const response = await fetch(`${N8N_WEBHOOK_URL}/community/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${EVOLUTION_API_KEY}`
        },
        body: JSON.stringify({
          communityId: community.id,
          communityName: community.name,
          adminPhone: community.admin_phone,
          description: community.description
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao criar grupo no WhatsApp');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      throw error;
    }
  },

  async sendPlayerInvite(community: Community, player: Player): Promise<SendInviteResponse> {
    try {
      const response = await fetch(`${N8N_WEBHOOK_URL}/community/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${EVOLUTION_API_KEY}`
        },
        body: JSON.stringify({
          communityId: community.id,
          communityName: community.name,
          playerId: player.id,
          playerPhone: player.phone,
          groupId: community.whatsapp_group_id,
          inviteLink: community.whatsapp_group_invite_link
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar convite via WhatsApp');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar convite:', error);
      throw error;
    }
  }
};
