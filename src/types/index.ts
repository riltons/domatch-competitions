import { Database } from './supabase'

export type Community = Database['public']['Tables']['communities']['Row']
export type Competition = Database['public']['Tables']['competitions']['Row']

export interface CreateCommunityDTO {
  name: string
}

export interface CreateCompetitionDTO {
  name: string
  startDate: Date
  endDate: Date
  communityId: string
}

export interface UpdateCommunityDTO extends Partial<CreateCommunityDTO> {
  id: string
}

export interface UpdateCompetitionDTO extends Partial<CreateCompetitionDTO> {
  id: string
}

export interface Usuario {
  id: string
  email: string
  nome: string
  papel: 'admin' | 'organizador'
  telefone: string
  created_at: string
}

export interface Comunidade {
  id: string
  nome: string
  descricao: string
  admin_id: string
  grupo_whatsapp_id: string
  created_at: string
}

export interface Competicao {
  id: string
  nome: string
  comunidade_id: string
  data_inicio: string
  data_fim: string | null
  status: 'pendente' | 'ativa' | 'encerrada'
  created_at: string
}

export interface Jogador {
  id: string
  nome: string
  apelido: string | null
  telefone: string
  created_at: string
}

export interface Partida {
  id: string
  competicao_id: string
  data: string
  dupla1_jogador1_id: string
  dupla1_jogador2_id: string
  dupla2_jogador1_id: string
  dupla2_jogador2_id: string
  pontos_dupla1: number
  pontos_dupla2: number
  created_at: string
}
