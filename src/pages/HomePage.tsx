import { useAuth } from '@/features/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function HomePage() {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">
          Bem-vindo ao Dominó Competições
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Organize e gerencie suas competições de dominó de forma simples e eficiente
        </p>

        {user ? (
          <div className="grid gap-6 max-w-md mx-auto">
            <Button asChild size="lg">
              <Link to="/communities">Ver Minhas Comunidades</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/communities/new">Criar Nova Comunidade</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 max-w-md mx-auto">
            <Button asChild size="lg">
              <Link to="/register">Criar uma Conta</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Fazer Login</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Crie Comunidades</h3>
          <p className="text-muted-foreground">
            Organize seus jogadores em comunidades e mantenha tudo organizado
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Gerencie Competições</h3>
          <p className="text-muted-foreground">
            Crie e gerencie competições com diferentes formatos
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Acompanhe Resultados</h3>
          <p className="text-muted-foreground">
            Mantenha o histórico de partidas e acompanhe o desempenho dos jogadores
          </p>
        </div>
      </div>
    </div>
  )
}
