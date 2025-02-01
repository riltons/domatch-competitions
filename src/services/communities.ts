import { supabase } from '@/lib/supabase'
import { Community, CreateCommunityInput } from '@/types/community'

export const communitiesService = {
  async getCommunities(): Promise<Community[]> {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  },

  async createCommunity(input: CreateCommunityInput): Promise<Community> {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const { data, error } = await supabase
      .from('communities')
      .insert([{ ...input, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateCommunity(id: string, input: Partial<CreateCommunityInput>): Promise<Community> {
    const { data, error } = await supabase
      .from('communities')
      .update(input)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteCommunity(id: string): Promise<void> {
    const { error } = await supabase
      .from('communities')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
