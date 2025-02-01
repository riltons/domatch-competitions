import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { playersService } from '@/services/players'
import { toast } from 'sonner'

export function EditPlayerPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [phone, setPhone] = useState('')

  const { data: player, isLoading } = useQuery({
    queryKey: ['players', id],
    queryFn: () => playersService.getAllPlayers().then(players => 
      players.find(p => p.id === id)
    ),
    enabled: !!id
  })

  useEffect(() => {
    if (player) {
      setName(player.name)
      setNickname(player.nickname || '')
      setPhone(player.phone || '')
    }
  }, [player])

  const { mutate: updatePlayer, isPending } = useMutation({
    mutationFn: (data: { name: string; nickname?: string; phone?: string }) =>
      playersService.updatePlayer(id!, data),
    onSuccess: () => {
      toast.success('Jogador atualizado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['players'] })
      navigate('/players')
    },
    onError: (error) => {
      console.error('Erro ao atualizar jogador:', error)
      toast.error('Erro ao atualizar jogador. Por favor, tente novamente.')
    }
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('O nome é obrigatório')
      return
    }
    updatePlayer({
      name,
      nickname: nickname || null,
      phone: phone || null
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-muted-foreground">Jogador não encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Editar Jogador</h2>
        <p className="text-muted-foreground">
          Atualize as informações do jogador
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
          <Label htmlFor="nickname">Apelido</Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Apelido do jogador"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(00) 00000-0000"
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Salvar'}
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
