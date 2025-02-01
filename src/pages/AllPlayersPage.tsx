import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { playersService } from '@/services/players'
import { UserPlus } from 'lucide-react'

export function AllPlayersPage() {
  const { data: players, isLoading } = useQuery({
    queryKey: ['players'],
    queryFn: () => playersService.getAllPlayers()
  })

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
            Veja todos os jogadores do sistema
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {players?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum jogador encontrado.
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
    </div>
  )
}
