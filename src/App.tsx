import { useState } from 'react'
import { supabase } from './lib/supabase'
import { AuthProvider } from './features/auth/AuthProvider'
import { LoginForm } from './features/auth/LoginForm'
import { useAuth } from './features/auth/AuthProvider'
import { CommunityList } from './features/communities/CommunityList'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Competições de Dominó</h1>
          <div className="text-sm">
            Olá, {user.nome}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <CommunityList />
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Competições Ativas</h2>
            {/* Lista de competições será implementada aqui */}
          </section>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
