import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { playersService } from '@/services/players'
import { toast } from 'sonner'
import { MoreVertical, Plus, Search } from 'lucide-react'

export function AllPlayersPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')

  const { data: players = [], isLoading } = useQuery({
    queryKey: ['players'],
    queryFn: playersService.getAllPlayers
  })

  const { mutate: deletePlayer } = useMutation({
    mutationFn: playersService.deletePlayer,
    onSuccess: () => {
      toast.success('Jogador excluído com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['players'] })
    },
    onError: (error) => {
      console.error('Erro ao excluir jogador:', error)
      toast.error('Erro ao excluir jogador. Por favor, tente novamente.')
    }
  })

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(search.toLowerCase()) ||
    player.nickname?.toLowerCase().includes(search.toLowerCase()) ||
    player.phone?.toLowerCase().includes(search.toLowerCase())
  )

  function handleDelete(id: string) {
    if (window.confirm('Tem certeza que deseja excluir este jogador?')) {
      deletePlayer(id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Jogadores</h2>
          <p className="text-muted-foreground">
            Gerencie os jogadores do sistema
          </p>
        </div>

        <div className="hidden sm:block">
          <Button onClick={() => navigate('/players/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Jogador
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            placeholder="Buscar jogadores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Apelido</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredPlayers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Nenhum jogador encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredPlayers.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.nickname || '-'}</TableCell>
                  <TableCell>{player.phone || '-'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => navigate(`/players/${player.id}/edit`)}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(player.id)}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Button
        className="fixed bottom-4 right-4 sm:hidden"
        size="icon"
        onClick={() => navigate('/players/new')}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
