import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { LoginPage } from '@/features/auth/LoginPage'
import { HomePage } from '@/pages/Home'
import { CommunitiesPage } from '@/pages/CommunitiesPage'
import { CommunityPlayersPage } from '@/pages/CommunityPlayersPage'
import { AllPlayersPage } from '@/pages/AllPlayersPage'
import { EditPlayerPage } from '@/pages/EditPlayerPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/communities/:id/players" element={<CommunityPlayersPage />} />
            <Route path="/players" element={<AllPlayersPage />} />
            <Route path="/players/:id/edit" element={<EditPlayerPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
