import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Pencil } from 'lucide-react'
import { Database } from '@/types/supabase'

type Community = Database['public']['Tables']['communities']['Row']

interface CommunityCardProps {
  community: Community
}

export function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Card className="group relative h-full transition-colors hover:border-primary">
      <Link to={`/communities/${community.id}/manage`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {community.name}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {community.description ? (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {community.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Nenhuma descrição
            </p>
          )}
        </CardContent>
      </Link>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        asChild
        onClick={(e) => e.stopPropagation()}
      >
        <Link to={`/communities/${community.id}/edit`}>
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Editar comunidade</span>
        </Link>
      </Button>
    </Card>
  )
}
