import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DBProvider } from './contexts/DBContext';
import CapturePage from './pages/CapturePage';
import GoalsPage from './pages/GoalsPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedPage from './pages/ProtectedPage';
import ReviewPage from './pages/ReviewPage';
import SignupPage from './pages/SignupPage';
import TodoPage from './pages/TodoPage';
import ScreensPage from './pages/ScreensPage';
import TypesPage from './pages/TypesPage';

function App() {
  return (
    <AuthProvider>
      <DBProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/capture" />} />
            <Route path="/capture" element={<ProtectedPage><CapturePage /></ProtectedPage>} title="Capture" />
            <Route path="/goals" element={<ProtectedPage><GoalsPage /></ProtectedPage>} title="Priorities" />
            <Route path="/todo" element={<ProtectedPage><TodoPage /></ProtectedPage>} title="Todo" />
            <Route path="/review" element={<ProtectedPage><ReviewPage /></ProtectedPage>} />
            <Route path="/screens/*" element={<ProtectedPage><ScreensPage /></ProtectedPage>} />
            <Route path="/types" element={<ProtectedPage><TypesPage /></ProtectedPage>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </DBProvider>
    </AuthProvider>
  );
}

export default App;
