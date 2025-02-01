import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { communitiesService } from '@/services/communities'
import { Fab } from '@/components/ui/fab'
import { Users } from 'lucide-react'
import { CommunityCard } from '@/components/ui/community-card'

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
              <CommunityCard key={community.id} community={community} />
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
