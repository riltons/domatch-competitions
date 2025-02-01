import { useAuth } from '@/features/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { authService } from '@/services/auth'
import { useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Logo } from '@/components/ui/logo'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await authService.logout()
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4 h-16">
          <div className="flex h-full items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Logo className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Domatch
              </span>
            </Link>

            {/* Menu para Desktop */}
            {!loading && (
              <div className="hidden md:flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Olá, {user.email}</span>
                    <Button variant="ghost" asChild>
                      <Link to="/communities">Comunidades</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link to="/profile">Perfil</Link>
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                      Sair
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button asChild variant="ghost">
                      <Link to="/login">Entrar</Link>
                    </Button>
                    <Button asChild variant="default">
                      <Link to="/register">Criar Conta</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Botão do Menu Mobile */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-accent"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Menu Mobile */}
          {isMenuOpen && !loading && (
            <div className="md:hidden absolute top-16 left-0 right-0 border-b bg-background shadow-lg">
              <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <span className="text-sm text-muted-foreground">Olá, {user.email}</span>
                    <Button variant="ghost" asChild className="justify-start">
                      <Link to="/communities">Comunidades</Link>
                    </Button>
                    <Button variant="ghost" asChild className="justify-start">
                      <Link to="/profile">Perfil</Link>
                    </Button>
                    <Button variant="outline" onClick={handleLogout} className="justify-start">
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" className="justify-start">
                      <Link to="/login">Entrar</Link>
                    </Button>
                    <Button asChild variant="default" className="justify-start">
                      <Link to="/register">Criar Conta</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          {new Date().getFullYear()} Domatch. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
