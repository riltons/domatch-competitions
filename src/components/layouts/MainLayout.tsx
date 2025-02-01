import { useAuth } from '@/features/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { authService } from '@/services/auth'
import { useNavigate } from 'react-router-dom'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authService.logout()
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Dominó Competições
          </Link>
          
          {!loading && (
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm">Olá, {user.email}</span>
                  <Button variant="outline" asChild>
                    <Link to="/communities">Comunidades</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/profile">Perfil</Link>
                  </Button>
                  <Button variant="ghost" onClick={handleLogout}>
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button asChild variant="ghost">
                    <Link to="/login">Entrar</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register">Criar Conta</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  )
}
