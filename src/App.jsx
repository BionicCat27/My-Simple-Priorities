import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
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

const firebaseConfig = {
  apiKey: "AIzaSyD8UFVmCrGkosxreqnQbr4wfe9uDPi4L9w",
  authDomain: "my-simple-priorities.firebaseapp.com",
  databaseURL: "https://my-simple-priorities-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-simple-priorities",
  storageBucket: "my-simple-priorities.appspot.com",
  messagingSenderId: "783456794609",
  appId: "1:783456794609:web:1ccfbec5791775a46ab650",
  measurementId: "G-MXL65K2JZC"
};

function App() {
  initializeApp(firebaseConfig);
  if (import.meta.env.MODE === "development") {
      const hostname = "127.0.0.1";
      connectAuthEmulator(getAuth(), `http://${hostname}:9099`);
      connectDatabaseEmulator(getDatabase(), hostname, 9000);
      console.log("Development mode enabled, connected to emulators");
  }
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
