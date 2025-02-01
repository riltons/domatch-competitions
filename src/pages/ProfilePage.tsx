import { useAuth } from '@/features/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p>{user.email}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">ID do Usuário</label>
            <p className="font-mono text-sm">{user.id}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Conta criada em</label>
            <p>{new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="pt-4">
            <Button variant="outline">Atualizar Senha</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
