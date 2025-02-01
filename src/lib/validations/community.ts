import { z } from 'zod'

export const createCommunitySchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(255, 'Nome muito longo')
})

export const updateCommunitySchema = createCommunitySchema.partial().extend({
  id: z.string().uuid()
})

export type CreateCommunityInput = z.infer<typeof createCommunitySchema>
export type UpdateCommunityInput = z.infer<typeof updateCommunitySchema>
