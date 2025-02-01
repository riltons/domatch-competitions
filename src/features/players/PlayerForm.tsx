import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { playersService } from '@/services/players'
import { createPlayerSchema, type CreatePlayerSchema } from '@/lib/validations/player'

interface PlayerFormProps {
  communityId: string
  onSuccess?: () => void
}

export function PlayerForm({ communityId, onSuccess }: PlayerFormProps) {
  const queryClient = useQueryClient()
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreatePlayerSchema>({
    resolver: zodResolver(createPlayerSchema),
    defaultValues: {
      communityId
    }
  })

  const { mutate: createPlayer, isPending } = useMutation({
    mutationFn: playersService.createPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', communityId] })
      reset()
      onSuccess?.()
    },
    onError: (error: Error) => {
      setError('Erro ao criar jogador. Tente novamente.')
      console.error(error)
    }
  })

  return (
    <form onSubmit={handleSubmit((data) => createPlayer(data))} className="space-y-4">
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          placeholder="Nome do jogador"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="nickname">Apelido</Label>
        <Input
          id="nickname"
          placeholder="Apelido do jogador (opcional)"
          {...register('nickname')}
        />
        {errors.nickname && (
          <p className="text-sm text-destructive">{errors.nickname.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Email do jogador (opcional)"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          placeholder="Telefone do jogador (opcional)"
          {...register('phone')}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSuccess?.()}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-[#22c55e] hover:bg-[#16a34a] text-white"
        >
          {isPending ? 'Salvando...' : 'Salvar Jogador'}
        </Button>
      </div>
    </form>
  )
}
