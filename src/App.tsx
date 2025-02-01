import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthProvider'
import { MainLayout } from '@/components/layouts/MainLayout'
import { HomePage } from '@/pages/HomePage'
import { ProfilePage } from '@/pages/ProfilePage'
import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { CommunitiesPage } from '@/pages/CommunitiesPage'
import { NewCommunityPage } from '@/pages/NewCommunityPage'
import { PlayersPage } from '@/pages/PlayersPage'
import { AllPlayersPage } from '@/pages/AllPlayersPage'
import { NewPlayerPage } from '@/pages/NewPlayerPage'
import { EditPlayerPage } from '@/pages/EditPlayerPage'
import { Toaster } from 'sonner'

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (user) {
    return <Navigate to="/" />
  }

  return children
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return <MainLayout>{children}</MainLayout>
}

export function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/communities"
          element={
            <ProtectedRoute>
              <CommunitiesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/communities/new"
          element={
            <ProtectedRoute>
              <NewCommunityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/communities/:id/players"
          element={
            <ProtectedRoute>
              <PlayersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/players"
          element={
            <ProtectedRoute>
              <AllPlayersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/players/new"
          element={
            <ProtectedRoute>
              <NewPlayerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/players/:id/edit"
          element={
            <ProtectedRoute>
              <EditPlayerPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
