import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DBProvider } from './contexts/DBContext';
import CapturePage from './pages/CapturePage';
import GoalsPage from './pages/GoalsPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ReviewPage from './pages/ReviewPage';
import SignupPage from './pages/SignupPage';
import TodoPage from './pages/TodoPage';
import ScreensPage, { ScreenPage } from './pages/ScreensPage';
import TypesPage from './pages/TypesPage';
import PageWrapper from './pages/PageWrapper';

function App() {
  return (
    <AuthProvider>
      <DBProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/capture" />} />
            <Route path="/capture" element={<PageWrapper protected navmenu={"Capture"} page={<CapturePage />} />} title="Capture" />
            <Route path="/goals" element={<PageWrapper protected navmenu={"Goals"} page={<GoalsPage />} />} title="Priorities" />
            <Route path="/todo" element={<PageWrapper protected navmenu={"Todo"} page={<TodoPage />} />} title="Todo" />
            <Route path="/review" element={<PageWrapper protected navmenu={"Review"} page={<ReviewPage />} />} />
            <Route path="/screens" element={<PageWrapper protected navmenu={"Screens"} page={<ScreensPage />} />}/>
            <Route path="/screens/:screenId" element={<PageWrapper protected navmenu={"Screen"} page={<ScreenPage />} />}/>
            <Route path="/types" element={<PageWrapper protected navmenu={"Types"} page={<TypesPage />} />} />
            <Route path="/login" element={<PageWrapper redirector page={<LoginPage />} />} />
            <Route path="/signup" element={<PageWrapper redirector page={<SignupPage />} />} />
            <Route path="*" element={<PageWrapper navmenu={"Not Found"} page={<NotFoundPage />} />} />
          </Routes>
        </BrowserRouter>
      </DBProvider>
    </AuthProvider>
  );
}

export default App;
