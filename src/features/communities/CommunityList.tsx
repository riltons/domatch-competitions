import { useQuery } from '@tanstack/react-query'
import { communityService } from '@/services/community'
import { Button } from '../../components/ui/button'
import type { Comunidade } from '../../types'

export function CommunityList() {
  const { data: communities, isLoading, error } = useQuery({
    queryKey: ['communities'],
    queryFn: () => communityService.list()
  })

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro ao carregar comunidades</div>
  if (!communities?.length) return <div>Nenhuma comunidade encontrada</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Comunidades</h2>
        <Button>Nova Comunidade</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {communities.map((community) => (
          <div
            key={community.id}
            className="p-4 bg-card rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold">{community.name}</h3>
            <p className="text-sm text-muted-foreground">
              Criada em: {new Date(community.created_at).toLocaleDateString()}
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                Ver Detalhes
              </Button>
              <Button variant="secondary" size="sm">
                Gerenciar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
