import { useAuth } from '@/features/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/ui/logo'
import { ArrowRight, Users, Trophy, LineChart } from 'lucide-react'

export function HomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-[calc(100vh-14rem)] flex flex-col">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="flex items-center justify-center mb-6">
              <Logo className="w-16 h-16" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Bem-vindo ao Domatch
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Organize e gerencie suas competições de dominó de forma simples e eficiente
            </p>

            {user ? (
              <div className="grid gap-4 max-w-md mx-auto">
                <Button asChild size="lg" className="bg-[#22c55e] hover:bg-[#16a34a] text-white group">
                  <Link to="/communities" className="flex items-center justify-center">
                    Ver Minhas Comunidades
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/10">
                  <Link to="/communities/new">Criar Nova Comunidade</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 max-w-md mx-auto">
                <Button asChild size="lg" className="bg-[#22c55e] hover:bg-[#16a34a] text-white group">
                  <Link to="/register" className="flex items-center justify-center">
                    Criar uma Conta
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/10">
                  <Link to="/login">Fazer Login</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-6 bg-card rounded-lg border shadow-lg">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">Crie Comunidades</h3>
                <p className="text-muted-foreground text-center">
                  Organize seus jogadores em comunidades e mantenha tudo organizado
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-6 bg-card rounded-lg border shadow-lg">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">Gerencie Competições</h3>
                <p className="text-muted-foreground text-center">
                  Crie e gerencie competições com diferentes formatos
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-6 bg-card rounded-lg border shadow-lg">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                  <LineChart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">Acompanhe Resultados</h3>
                <p className="text-muted-foreground text-center">
                  Mantenha o histórico de partidas e acompanhe o desempenho dos jogadores
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
