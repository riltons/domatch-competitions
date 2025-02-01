import { supabase } from '@/lib/supabase'
import { Community, CreateCommunityDTO, UpdateCommunityDTO } from '@/types'

export const communityService = {
  async list(): Promise<Community[]> {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async create(community: CreateCommunityDTO): Promise<Community> {
    const { data, error } = await supabase
      .from('communities')
      .insert(community)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(community: UpdateCommunityDTO): Promise<Community> {
    const { data, error } = await supabase
      .from('communities')
      .update(community)
      .eq('id', community.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('communities')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
