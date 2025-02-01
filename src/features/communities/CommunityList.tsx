import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/button'
import type { Comunidade } from '../../types'

export function CommunityList() {
  const { data: communities, isLoading, error } = useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comunidades')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Comunidade[]
    },
  })

  if (isLoading) {
    return <div>Carregando comunidades...</div>
  }

  if (error) {
    return <div>Erro ao carregar comunidades: {error.message}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Comunidades</h2>
        <Button>Nova Comunidade</Button>
      </div>

      {communities?.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma comunidade encontrada. Crie uma nova para começar!
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {communities?.map((community) => (
            <div
              key={community.id}
              className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <h3 className="font-semibold mb-2">{community.nome}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {community.descricao}
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
      )}
    </div>
  )
}
