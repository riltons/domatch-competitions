import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'

type Player = Database['public']['Tables']['players']['Row']
type PlayerInsert = Database['public']['Tables']['players']['Insert']

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

export const playersService = {
  getAllPlayers,
  createPlayer
}
