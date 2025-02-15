import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DBProvider } from './contexts/DBContext';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ReviewPage from './pages/ReviewPage';
import SignupPage from './pages/SignupPage';
import TodoPage from './pages/TodoPage';
import AccountPage from './pages/AccountPage';
import { ScreenPage } from './pages/ScreensPage';
import ConfigurePage from './pages/ConfigurePage';
import PageWrapper from './pages/PageWrapper';

function App() {
  return (
    <AuthProvider>
      <DBProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/todo" />} />
            <Route path="/todo" element={<PageWrapper protected navmenu={"Todo"} page={<TodoPage />} />} title="Todo" />
            <Route path="/review" element={<PageWrapper protected navmenu={"Review"} page={<ReviewPage />} />} />
            <Route path="/screens/:screenId" element={<PageWrapper protected navmenu={"Screen"} page={<ScreenPage />} />} />
            <Route path="/configure" element={<PageWrapper protected navmenu={"Configure"} page={<ConfigurePage />} />} />
            <Route path="/account" element={<PageWrapper protected navmenu={"Account"} page={<AccountPage />} />} />
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
