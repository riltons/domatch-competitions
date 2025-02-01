import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'

type Player = Database['public']['Tables']['players']['Row']
type PlayerInsert = Database['public']['Tables']['players']['Insert']
type PlayerUpdate = Database['public']['Tables']['players']['Update']

async function getAllPlayers() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw sessionError
  if (!session?.user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}

async function getPlayers() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw sessionError
  if (!session?.user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .or(`created_by.eq.${session.user.id},organizer_id.eq.${session.user.id}`)
    .order('name')

  if (error) throw error
  return data
}

async function createPlayer(input: Omit<PlayerInsert, 'created_by'>) {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw sessionError
  if (!session?.user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('players')
    .insert({ ...input, created_by: session.user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

async function updatePlayer(id: string, input: PlayerUpdate) {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw sessionError
  if (!session?.user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('players')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

async function getPlayer(id: string) {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw sessionError
  if (!session?.user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

async function deletePlayer(id: string) {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw sessionError
  if (!session?.user) throw new Error('Usuário não autenticado')

  const { error } = await supabase
    .from('players')
    .delete()
    .eq('id', id)

  if (error) throw error
}

async function getAdminPlayers() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw sessionError
  if (!session?.user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('created_by', session.user.id)
    .order('name')

  if (error) throw error
  return data
}

export const playersService = {
  getAllPlayers,
  getPlayers,
  createPlayer,
  updatePlayer,
  getPlayer,
  deletePlayer,
  getAdminPlayers
}
