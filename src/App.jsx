import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { DBProvider } from './contexts/DBContext'
import CapturePage from './pages/CapturePage'
import TodoPage from './pages/TodoPage'
import PrioritiesPage from './pages/PrioritiesPage'
import ReviewPage from './pages/reviewPage'
import TimelinePage from './pages/TimelinePage'
import ProtectedPage from './pages/ProtectedPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'
import { connectDatabaseEmulator, getDatabase } from 'firebase/database'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import HealthPage from './pages/HealthPage'

function App() {
  return (
    <AuthProvider>
      <DBProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/capture" />} />
            <Route path="/capture" element={<ProtectedPage><CapturePage /></ProtectedPage>} title="Capture" />
            <Route path="/priorities" element={<ProtectedPage><PrioritiesPage /></ProtectedPage>} title="Priorities" />
            <Route path="/todo" element={<ProtectedPage><TodoPage /></ProtectedPage>} title="Todo" />
            <Route path="/review" element={<ProtectedPage><ReviewPage /></ProtectedPage>} />
            <Route path="/timeline" element={<ProtectedPage><TimelinePage /></ProtectedPage>} />
            <Route path="/health" element={<ProtectedPage><HealthPage /></ProtectedPage>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </DBProvider>
    </AuthProvider>
  )
}

export default App
