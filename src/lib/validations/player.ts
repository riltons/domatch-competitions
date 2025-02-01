import { z } from 'zod'

export const createPlayerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  nickname: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  communityId: z.string().uuid('ID da comunidade inválido')
})

export type CreatePlayerSchema = z.infer<typeof createPlayerSchema>
