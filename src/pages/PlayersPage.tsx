import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { playersService } from '@/services/players'
import { Fab } from '@/components/ui/fab'
import { UserPlus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function PlayersPage() {
  const { communityId } = useParams<{ communityId: string }>()
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const { data: players, isLoading } = useQuery({
    queryKey: ['players', communityId],
    queryFn: () => playersService.getPlayers(communityId!)
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await playersService.createPlayer({
        name,
        phone,
        community_id: communityId!
      })
      setIsOpen(false)
      setName('')
      setPhone('')
    } catch (error) {
      console.error('Erro ao criar jogador:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-muted-foreground">Carregando jogadores...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Jogadores</h2>
          <p className="text-muted-foreground">
            Gerencie os jogadores da sua comunidade
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-white hidden md:flex">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Jogador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Jogador</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Criar Jogador
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {players?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Você ainda não tem nenhum jogador.
            <br />
            Clique no botão para adicionar seu primeiro jogador.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {players?.map((player) => (
              <div
                key={player.id}
                className="p-4 rounded-lg border border-border bg-card text-card-foreground"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{player.name}</h3>
                    {player.phone && (
                      <p className="text-sm text-muted-foreground">
                        {player.phone}
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <span className="sr-only">Opções</span>
                    <i className="fas fa-ellipsis-v" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Fab onClick={() => setIsOpen(true)} label="Novo Jogador" />
    </div>
  )
}
