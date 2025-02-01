import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NewCommunityPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // TODO: Implementar criação da comunidade
      navigate('/communities')
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
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
          <Label htmlFor="name">Nome da Comunidade</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome da sua comunidade"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva sua comunidade"
            required
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Criando...' : 'Criar Comunidade'}
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
