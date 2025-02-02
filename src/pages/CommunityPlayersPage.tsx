import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowLeft, UserPlus, Trash2 } from 'lucide-react'
import { communitiesService } from '@/services/communities'
import { playersService } from '@/services/players'
import { toast } from 'sonner'
import { Player } from '@/types/player'

export function CommunityPlayersPage() {
  const { id: communityId } = useParams<{ id: string }>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const queryClient = useQueryClient()

  const { data: community, isLoading: isLoadingCommunity } = useQuery({
    queryKey: ['communities', communityId],
    queryFn: () => communitiesService.getCommunity(communityId!)
  })

  const { data: communityPlayers, isLoading: isLoadingPlayers } = useQuery({
    queryKey: ['community-players', communityId],
    queryFn: () => communitiesService.getCommunityPlayers(communityId!)
  })

  const { data: availablePlayers, isLoading: isLoadingAvailablePlayers } = useQuery({
    queryKey: ['available-players', communityId],
    queryFn: () => playersService.getAdminPlayers(),
    enabled: isDialogOpen
  })

  const { mutate: addPlayers, isPending: isAddingPlayers } = useMutation({
    mutationFn: async (playerIds: string[]) => {
      for (const playerId of playerIds) {
        await communitiesService.addPlayerToCommunity(communityId!, playerId)
      }
    },
    onSuccess: () => {
      toast.success(
        selectedPlayers.length === 1
          ? 'Jogador adicionado com sucesso!'
          : 'Jogadores adicionados com sucesso!'
      )
      queryClient.invalidateQueries({ queryKey: ['community-players'] })
      setIsDialogOpen(false)
      setSelectedPlayers([])
    },
    onError: (error) => {
      console.error('Erro ao adicionar jogadores:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Erro ao adicionar jogadores. Por favor, tente novamente.')
      }
    }
  })

  const { mutate: removePlayer } = useMutation({
    mutationFn: (playerId: string) =>
      communitiesService.removePlayerFromCommunity(communityId!, playerId),
    onSuccess: () => {
      toast.success('Jogador removido com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['community-players'] })
    },
    onError: (error) => {
      console.error('Erro ao remover jogador:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Erro ao remover jogador. Por favor, tente novamente.')
      }
    }
  })

  if (isLoadingCommunity) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-muted-foreground">Carregando comunidade...</p>
      </div>
    )
  }

  if (!community) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Comunidade não encontrada</p>
        <Button asChild variant="link" className="mt-2">
          <Link to="/communities">Voltar para Comunidades</Link>
        </Button>
      </div>
    )
  }

  const isPlayerInCommunity = (playerId: string) => {
    return communityPlayers?.some((player) => player.id === playerId)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedPlayers([])
  }

  const handleSelectPlayer = (playerId: string) => {
    setSelectedPlayers(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId)
      }
      return [...prev, playerId]
    })
  }

  const handleAddPlayers = () => {
    console.log('Adding players:', selectedPlayers)
    if (selectedPlayers.length > 0) {
      addPlayers(selectedPlayers)
    }
  }

  const nonCommunityPlayers = availablePlayers?.filter(
    (player) => !isPlayerInCommunity(player.id)
  ) || []

  return (
    <div className="space-y-8">
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-4 text-muted-foreground"
        >
          <Link
            to={`/communities/${communityId}/manage`}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Comunidade
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Jogadores - {community.name}
            </h2>
            <p className="text-muted-foreground">
              Gerencie os jogadores da sua comunidade
            </p>
          </div>

          {/* Botão visível apenas em desktop */}
          <div className="hidden md:block">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-white">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar Jogador
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Jogador à Comunidade</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {isLoadingAvailablePlayers ? (
                    <p className="text-center text-muted-foreground">
                      Carregando seus jogadores...
                    </p>
                  ) : nonCommunityPlayers.length === 0 ? (
                    <div className="text-center space-y-2">
                      <p className="text-muted-foreground">
                        {availablePlayers?.length === 0
                          ? 'Você ainda não tem jogadores cadastrados'
                          : 'Todos os seus jogadores já estão nesta comunidade'}
                      </p>
                      {availablePlayers?.length === 0 && (
                        <Button asChild variant="link">
                          <Link to="/players/new">
                            Cadastrar Novo Jogador
                          </Link>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Apelido</TableHead>
                          <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {nonCommunityPlayers.map((player) => (
                          <TableRow key={player.id}>
                            <TableCell>{player.name}</TableCell>
                            <TableCell>{player.nickname}</TableCell>
                            <TableCell>
                              <Button
                                variant={selectedPlayers.includes(player.id) ? "destructive" : "outline"}
                                onClick={() => handleSelectPlayer(player.id)}
                                size="sm"
                              >
                                {selectedPlayers.includes(player.id) ? "Remover" : "Selecionar"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={handleCloseDialog}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAddPlayers}
                    disabled={selectedPlayers.length === 0 || isAddingPlayers}
                    className="bg-[#22c55e] hover:bg-[#16a34a] text-white disabled:bg-gray-300"
                  >
                    {isAddingPlayers
                      ? 'Adicionando...'
                      : `Adicionar ${selectedPlayers.length} jogador${
                          selectedPlayers.length === 1 ? '' : 'es'
                        }`}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* FAB visível apenas em mobile */}
      <div className="md:hidden fixed bottom-20 right-6 z-50">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              className="h-14 w-14 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-lg"
            >
              <UserPlus className="h-6 w-6" />
              <span className="sr-only">Adicionar jogador</span>
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby="dialog-description">
            <DialogHeader>
              <DialogTitle>Adicionar Jogador</DialogTitle>
              <p id="dialog-description" className="text-sm text-muted-foreground">
                Selecione os jogadores que deseja adicionar à comunidade.
              </p>
            </DialogHeader>
            <div className="space-y-4">
              {isLoadingAvailablePlayers ? (
                <p className="text-center text-muted-foreground">
                  Carregando seus jogadores...
                </p>
              ) : nonCommunityPlayers.length === 0 ? (
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">
                    {availablePlayers?.length === 0
                      ? 'Você ainda não tem jogadores cadastrados'
                      : 'Todos os seus jogadores já estão nesta comunidade'}
                  </p>
                  {availablePlayers?.length === 0 && (
                    <Button asChild variant="link">
                      <Link to="/players/new">
                        Cadastrar Novo Jogador
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Apelido</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nonCommunityPlayers.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{player.nickname}</TableCell>
                        <TableCell>
                          <Button
                            variant={selectedPlayers.includes(player.id) ? "destructive" : "outline"}
                            onClick={() => handleSelectPlayer(player.id)}
                            size="sm"
                          >
                            {selectedPlayers.includes(player.id) ? "Remover" : "Selecionar"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddPlayers}
                disabled={selectedPlayers.length === 0 || isAddingPlayers}
                className="bg-[#22c55e] hover:bg-[#16a34a] text-white disabled:bg-gray-300"
              >
                {isAddingPlayers
                  ? 'Adicionando...'
                  : `Adicionar ${selectedPlayers.length} jogador${
                      selectedPlayers.length === 1 ? '' : 'es'
                    }`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        {isLoadingPlayers ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Carregando jogadores...</p>
          </div>
        ) : communityPlayers?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum jogador nesta comunidade.
            <br />
            Clique no botão para adicionar jogadores.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Apelido</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communityPlayers?.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.nickname}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removePlayer(player.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remover jogador</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
