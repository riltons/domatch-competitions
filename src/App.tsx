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

  return children
}

export function App() {
  return (
    <BrowserRouter>
      <MainLayout>
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
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/communities/new" element={<NewCommunityPage />} />
            <Route path="/communities/:communityId/players" element={<PlayersPage />} />
            <Route path="/players" element={<AllPlayersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}
