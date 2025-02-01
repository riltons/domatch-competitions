import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

export function CommunitiesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Minhas Comunidades</h2>
          <p className="text-muted-foreground">
            Gerencie suas comunidades e jogadores
          </p>
        </div>
        <Button asChild className="bg-[#22c55e] hover:bg-[#16a34a] text-white">
          <Link to="/communities/new" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Nova Comunidade
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {/* Lista de comunidades será adicionada aqui */}
        <div className="text-center py-8 text-muted-foreground">
          Você ainda não tem nenhuma comunidade.
          <br />
          Clique no botão acima para criar sua primeira comunidade.
        </div>
      </div>
    </div>
  )
}
