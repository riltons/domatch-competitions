import { Community, Player } from '../types/supabase';
import { supabase } from '../lib/supabase';

// Usando o proxy do Vite
const WHATSAPP_API_URL = '/api';
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

interface WhatsAppStatus {
  isReady: boolean;
  qrCode: string | null;
}

// Função para formatar número de telefone
function formatPhoneNumber(phone: string): string {
  // Remove todos os caracteres não numéricos
  let cleaned = phone.replace(/\D/g, '');

  // Se o número não começar com 55 (código do Brasil), adiciona
  if (!cleaned.startsWith('55')) {
    cleaned = '55' + cleaned;
  }

  // Se o número começar com 0 depois do 55, remove o 0
  if (cleaned.length > 2 && cleaned.charAt(2) === '0') {
    cleaned = cleaned.substring(0, 2) + cleaned.substring(3);
  }

  // Garante que o número tem o formato correto (55 + DDD + número)
  // Exemplo: 5511999999999
  if (cleaned.length < 12 || cleaned.length > 13) {
    throw new Error(`Número de telefone inválido: ${cleaned}. Deve ter entre 12 e 13 dígitos incluindo o código do país (55)`);
  }

  return cleaned;
}

export const whatsappService = {
  async getStatus(): Promise<WhatsAppStatus> {
    try {
      const response = await fetch(`${WHATSAPP_API_URL}/status`, {
        headers: {
          'Content-Type': 'application/json',
          'apikey': WHATSAPP_API_KEY
        }
      });

      const responseText = await response.text();
      console.log('Resposta bruta do status:', responseText);

      if (!response.ok) {
        throw new Error(`Falha ao obter status do WhatsApp: ${responseText}`);
      }

      try {
        const data = JSON.parse(responseText);
        return data;
      } catch (e) {
        console.error('Erro ao fazer parse da resposta:', e);
        throw new Error('Resposta inválida da API do WhatsApp');
      }
    } catch (error) {
      console.error('Erro ao obter status:', error);
      throw error;
    }
  },

  async createCommunityGroup(community: Community): Promise<CreateGroupResponse> {
    try {
      if (!community.admin_phone) {
        throw new Error('Telefone do administrador não fornecido');
      }

      // Verifica o status do WhatsApp
      const status = await this.getStatus();
      if (!status.isReady) {
        throw new Error('WhatsApp não está conectado. Por favor, escaneie o QR code: ' + status.qrCode);
      }

      // Formata o número do telefone para o formato correto
      const formattedPhone = formatPhoneNumber(community.admin_phone);

      console.log('Criando grupo no WhatsApp:', {
        url: `${WHATSAPP_API_URL}/group/create`,
        headers: {
          'Content-Type': 'application/json',
          'apikey': WHATSAPP_API_KEY
        },
        body: {
          subject: community.name,
          participants: [formattedPhone]
        }
      });

      const response = await fetch(`${WHATSAPP_API_URL}/group/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': WHATSAPP_API_KEY
        },
        body: JSON.stringify({
          subject: community.name,
          participants: [formattedPhone]
        })
      });

      const responseText = await response.text();
      console.log('Resposta bruta da API:', responseText);

      if (!response.ok) {
        console.error('Resposta da API do WhatsApp:', {
          status: response.status,
          statusText: response.statusText,
          body: responseText
        });
        throw new Error(`Falha ao criar grupo no WhatsApp: ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Erro ao fazer parse da resposta:', e);
        throw new Error('Resposta inválida da API do WhatsApp');
      }

      console.log('Resposta da API do WhatsApp:', data);

      // Atualiza a comunidade com os dados do grupo
      const { error: updateError } = await supabase
        .from('communities')
        .update({
          whatsapp_group_id: data.id,
          whatsapp_group_invite_link: data.inviteLink,
          whatsapp_group_qr_code: data.qrCode
        })
        .eq('id', community.id);

      if (updateError) {
        console.error('Erro ao atualizar comunidade:', updateError);
        throw updateError;
      }

      return {
        id: data.id,
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

      if (!player.phone) {
        throw new Error('Telefone do jogador não fornecido');
      }

      // Verifica o status do WhatsApp
      const status = await this.getStatus();
      if (!status.isReady) {
        throw new Error('WhatsApp não está conectado. Por favor, escaneie o QR code: ' + status.qrCode);
      }

      // Formata o número do telefone para o formato correto
      const formattedPhone = formatPhoneNumber(player.phone);

      console.log('Enviando convite para jogador:', {
        url: `${WHATSAPP_API_URL}/message/text`,
        headers: {
          'Content-Type': 'application/json',
          'apikey': WHATSAPP_API_KEY
        },
        body: {
          number: formattedPhone,
          options: {
            delay: 1200
          },
          textMessage: {
            text: `Olá! Você foi convidado para participar da comunidade "${community.name}". Clique no link para entrar no grupo: ${community.whatsapp_group_invite_link}`
          }
        }
      });

      const response = await fetch(`${WHATSAPP_API_URL}/message/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': WHATSAPP_API_KEY
        },
        body: JSON.stringify({
          number: formattedPhone,
          options: {
            delay: 1200
          },
          textMessage: {
            text: `Olá! Você foi convidado para participar da comunidade "${community.name}". Clique no link para entrar no grupo: ${community.whatsapp_group_invite_link}`
          }
        })
      });

      const responseText = await response.text();
      console.log('Resposta bruta da API:', responseText);

      if (!response.ok) {
        console.error('Resposta da API do WhatsApp:', {
          status: response.status,
          statusText: response.statusText,
          body: responseText
        });
        throw new Error(`Falha ao enviar convite: ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Erro ao fazer parse da resposta:', e);
        throw new Error('Resposta inválida da API do WhatsApp');
      }

      console.log('Resposta da API do WhatsApp:', data);

      return {
        messageId: data.key.id,
        status: data.status === 'PENDING' ? 'sent' : 'failed'
      };
    } catch (error) {
      console.error('Erro ao enviar convite:', error);
      throw error;
    }
  }
};
