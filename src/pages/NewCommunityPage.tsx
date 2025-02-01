import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { communitiesService } from '@/services/communities'
import { toast } from 'sonner'
import { useAuth } from '@/features/auth/AuthProvider'

export function NewCommunityPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, loading } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const { mutate: createCommunity, isPending } = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Usuário não autenticado')
      return communitiesService.createCommunity({
        name,
        description: description || null,
        active: true
      })
    },
    onSuccess: () => {
      toast.success('Comunidade criada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['communities'] })
      navigate('/communities')
    },
    onError: (error) => {
      console.error('Erro ao criar comunidade:', error)
      if (error instanceof Error && error.message === 'Usuário não autenticado') {
        toast.error('Você precisa estar logado para criar uma comunidade')
        navigate('/login')
      } else {
        toast.error('Erro ao criar comunidade. Por favor, tente novamente.')
      }
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('O nome da comunidade é obrigatório')
      return
    }
    createCommunity()
  }

  if (loading) {
    return <div>Carregando...</div>
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

        <h2 className="text-3xl font-bold tracking-tight">Nova Comunidade</h2>
        <p className="text-muted-foreground">
          Crie uma nova comunidade para gerenciar seus jogadores e campeonatos
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
            {isPending ? 'Criando...' : 'Criar Comunidade'}
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
