import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import { communitiesService } from '@/services/communities'
import { toast } from 'sonner'

export function EditCommunityPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const { data: community, isLoading: isLoadingCommunity } = useQuery({
    queryKey: ['communities', id],
    queryFn: () => communitiesService.getCommunity(id!)
  })

  const [name, setName] = useState(community?.name ?? '')
  const [description, setDescription] = useState(community?.description ?? '')

  const { mutate: updateCommunity, isPending } = useMutation({
    mutationFn: () => communitiesService.updateCommunity(id!, {
      name,
      description: description || null
    }),
    onSuccess: () => {
      toast.success('Comunidade atualizada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['communities'] })
      navigate('/communities')
    },
    onError: (error) => {
      console.error('Erro ao atualizar comunidade:', error)
      if (error instanceof Error && error.message === 'Usuário não autenticado') {
        toast.error('Você precisa estar logado para atualizar uma comunidade')
        navigate('/login')
      } else {
        toast.error('Erro ao atualizar comunidade. Por favor, tente novamente.')
      }
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('O nome da comunidade é obrigatório')
      return
    }
    updateCommunity()
  }

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

  return (
    <div className="max-w-2xl mx-auto space-y-8">
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

        <h2 className="text-3xl font-bold tracking-tight">Editar Comunidade</h2>
        <p className="text-muted-foreground">
          Atualize as informações da sua comunidade
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Comunidade *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome da sua comunidade"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição (opcional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva sua comunidade"
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isPending}
          >
            {isPending ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/communities')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
