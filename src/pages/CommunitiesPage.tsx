import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { communitiesService } from '@/services/communities'
import { Fab } from '@/components/ui/fab'
import { Users, UserPlus, Trophy } from 'lucide-react'

export function CommunitiesPage() {
  const { data: communities, isLoading } = useQuery({
    queryKey: ['communities'],
    queryFn: communitiesService.getCommunities
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-muted-foreground">Carregando comunidades...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Comunidades</h2>
          <p className="text-muted-foreground">
            Gerencie suas comunidades de dominó
          </p>
        </div>
        <Button
          asChild
          className="bg-[#22c55e] hover:bg-[#16a34a] text-white hidden md:flex"
        >
          <Link to="/communities/new">
            <Users className="mr-2 h-4 w-4" />
            Nova Comunidade
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {communities?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Você ainda não tem nenhuma comunidade.
            <br />
            Clique no botão para criar sua primeira comunidade.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {communities?.map((community) => (
              <div
                key={community.id}
                className="p-4 rounded-lg border border-border bg-card text-card-foreground"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{community.name}</h3>
                    {community.description && (
                      <p className="text-sm text-muted-foreground">
                        {community.description}
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <span className="sr-only">Opções</span>
                    <i className="fas fa-ellipsis-v" />
                  </Button>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Link to={`/communities/${community.id}/players`}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Jogadores
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Link to={`/communities/${community.id}/competitions`}>
                      <Trophy className="mr-2 h-4 w-4" />
                      Competições
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Fab
        href="/communities/new"
        label="Nova Comunidade"
      />
    </div>
  )
}
