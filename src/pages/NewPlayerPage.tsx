import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { playersService } from '@/services/players'
import { toast } from 'sonner'

export function NewPlayerPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const { mutate: createPlayer, isPending } = useMutation({
    mutationFn: () => playersService.createPlayer({ 
      name, 
      phone: phone || null, 
      active: true 
    }),
    onSuccess: () => {
      toast.success('Jogador criado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['players'] })
      navigate('/players')
    },
    onError: (error) => {
      console.error('Erro ao criar jogador:', error)
      toast.error('Erro ao criar jogador. Por favor, tente novamente.')
    }
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('O nome é obrigatório')
      return
    }
    createPlayer()
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Novo Jogador</h2>
        <p className="text-muted-foreground">
          Adicione um novo jogador ao sistema
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Nome do jogador"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone (opcional)</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(00) 00000-0000"
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Criando...' : 'Criar Jogador'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/players')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
