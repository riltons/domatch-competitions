import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'

type Player = Database['public']['Tables']['players']['Row']
type PlayerInsert = Database['public']['Tables']['players']['Insert']
type PlayerUpdate = Database['public']['Tables']['players']['Update']

async function getAllPlayers() {
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .or(`created_by.eq.${user.user.id},organizer_id.eq.${user.user.id}`)
    .order('name')

  if (error) {
    throw error
  }

  return data
}

async function createPlayer(player: Omit<PlayerInsert, 'created_by'>) {
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('players')
    .insert({ ...player, created_by: user.user.id })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

async function updatePlayer(id: string, player: PlayerUpdate) {
  const { data, error } = await supabase
    .from('players')
    .update(player)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

async function deletePlayer(id: string) {
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}

export const playersService = {
  getAllPlayers,
  createPlayer,
  updatePlayer,
  deletePlayer
}
