import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DBProvider } from './contexts/DBContext';
import CapturePage from './pages/CapturePage';
import GoalsPage from './pages/GoalsPage';
import HealthPage from './pages/HealthPage';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedPage from './pages/ProtectedPage';
import ReviewPage from './pages/ReviewPage';
import TodoPage from './pages/TodoPage';

function App() {
  return (
    <AuthProvider>
      <DBProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/capture" />} />
            <Route path="/capture" element={<ProtectedPage><CapturePage /></ProtectedPage>} />
            <Route path="/goals" element={<ProtectedPage><GoalsPage /></ProtectedPage>} />
            <Route path="/todo" element={<ProtectedPage><TodoPage /></ProtectedPage>} />
            <Route path="/review" element={<ProtectedPage><ReviewPage /></ProtectedPage>} />
            <Route path="/health" element={<ProtectedPage><HealthPage /></ProtectedPage>} />
            <Route path="/login" element={<LandingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </DBProvider>
    </AuthProvider>
  );
}

export default App;
