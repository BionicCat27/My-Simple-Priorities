import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import { DBProvider } from './contexts/DBContext'
import CapturePage from './pages/CapturePage'
import TodoPage from './pages/TodoPage'
import PrioritiesPage from './pages/PrioritiesPage'
import ReviewPage from './pages/reviewPage'
import LoginPage from './pages/login/loginPage'
import SignupPage from './pages/signup/signupPage'
import NotFoundPage from './pages/notFound/NotFoundPage'
import TimelinePage from './pages/timeline/TimelinePage'

function App() {
  return (
    <AuthProvider>
      <DBProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CapturePage />} title="Capture"/>
            <Route path="/capture" element={<CapturePage />} title="Capture" />
            <Route path="/priorities" element={<PrioritiesPage />} title="Priorities" />
            <Route path="/todo" element={<TodoPage />} title="Todo" />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
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
