import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './state/AppContext'
import { Layout } from './components/Layout'
import { Landing } from './pages/Landing'
import { ProfileForm } from './pages/ProfileForm'
import { Diagnosis } from './pages/Diagnosis'
import { Recommendations } from './pages/Recommendations'
import { Compare } from './pages/Compare'
import { Roadmap } from './pages/Roadmap'

function Guard({ children }: { children: React.ReactNode }) {
  const { profileCompleted } = useApp()
  const location = useLocation()
  if (!profileCompleted && location.pathname !== '/' && location.pathname !== '/profile') {
    return <Navigate to="/profile" replace />
  }
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/profile" element={<ProfileForm />} />
        <Route
          path="/diagnosis"
          element={
            <Guard>
              <Diagnosis />
            </Guard>
          }
        />
        <Route
          path="/recommendations"
          element={
            <Guard>
              <Recommendations />
            </Guard>
          }
        />
        <Route
          path="/compare"
          element={
            <Guard>
              <Compare />
            </Guard>
          }
        />
        <Route
          path="/roadmap"
          element={
            <Guard>
              <Roadmap />
            </Guard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  )
}
