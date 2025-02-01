import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, Trophy, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { communitiesService } from '@/services/communities'

export function ManageCommunityPage() {
  const { id } = useParams<{ id: string }>()
  const { data: community, isLoading } = useQuery({
    queryKey: ['communities', id],
    queryFn: () => communitiesService.getCommunity(id!)
  })

  if (isLoading) {
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

  return (
    <div className="space-y-8">
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-4 text-muted-foreground"
        >
          <Link to="/communities" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Comunidades
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{community.name}</h2>
            {community.description && (
              <p className="text-muted-foreground">{community.description}</p>
            )}
          </div>
          <Button asChild variant="outline">
            <Link to={`/communities/${community.id}/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="transition-colors hover:border-primary">
          <Link to={`/communities/${community.id}/players`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Jogadores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gerencie os jogadores da sua comunidade
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="transition-colors hover:border-primary">
          <Link to={`/communities/${community.id}/competitions`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Competições
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gerencie as competições da sua comunidade
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}
