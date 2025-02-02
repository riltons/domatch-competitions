export interface Community {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  created_by: string;
  whatsapp_group_id?: string;
  admin_phone?: string;
  whatsapp_group_invite_link?: string;
  whatsapp_group_qr_code?: string;
}

export interface Player {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  created_at: string;
  created_by: string;
  whatsapp_id?: string;
}

export interface CommunityPlayer {
  id: string;
  community_id: string;
  player_id: string;
  created_at: string;
  invitation_status: 'pending' | 'accepted' | 'rejected';
  player_phone?: string;
  whatsapp_status?: 'pending' | 'accepted' | 'rejected';
}

export type CommunityInsert = Omit<Community, 'id' | 'created_at'>;
export type PlayerInsert = Omit<Player, 'id' | 'created_at'>;
export type CommunityPlayerInsert = Omit<CommunityPlayer, 'id' | 'created_at'>;