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
import { whatsappService } from '@/services/whatsapp'
import { toast } from 'sonner'
import { useAuth } from '@/features/auth/AuthProvider'

export function NewCommunityPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, loading } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [adminPhone, setAdminPhone] = useState('')
  const [qrCode, setQrCode] = useState<string | null>(null)

  const { mutate: createCommunity, isPending, error } = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Usuário não autenticado')
      try {
        // Primeiro verifica o status do WhatsApp
        const status = await whatsappService.getStatus();
        if (!status.isReady && status.qrCode) {
          setQrCode(status.qrCode);
          throw new Error('WhatsApp não está conectado. Por favor, escaneie o QR code.');
        }

        // Se o WhatsApp estiver conectado, cria a comunidade
        return await communitiesService.createCommunity({
          name,
          description: description || null,
          active: true,
          admin_phone: adminPhone
        })
      } catch (error) {
        console.error('Erro ao criar comunidade:', error)
        throw error
      }
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
    if (!adminPhone.trim()) {
      toast.error('O telefone do administrador é obrigatório')
      return
    }
    if (!adminPhone.match(/^\+?[1-9]\d{10,14}$/)) {
      toast.error('O telefone deve estar no formato internacional (ex: +5511999999999)')
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

      {error && (
        <div className="mb-4">
          <p className="text-sm text-red-500">{(error as Error).message}</p>
        </div>
      )}

      {qrCode && (
        <div className="mb-4 text-center">
          <p className="text-sm">Escaneie o QR code abaixo para conectar o WhatsApp:</p>
          <img src={qrCode} alt="WhatsApp QR Code" style={{ maxWidth: '100%' }} />
        </div>
      )}

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
          <Label htmlFor="adminPhone">Telefone do Administrador *</Label>
          <Input
            id="adminPhone"
            value={adminPhone}
            onChange={(e) => setAdminPhone(e.target.value)}
            placeholder="+5511999999999"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Digite o número no formato internacional (ex: +5511999999999)
          </p>
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
