import React from 'react';
import ReacDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './firebaseConfig';

//Components
import LoginPage from './pages/login/loginPage.js';
import SignupPage from './pages/signup/signupPage.js';
import NotFoundPage from './pages/notFoundPage.js';
import TodoPage from './pages/todo/todoPage.js';
import PrioritiesPage from './pages/priorities/prioritiesPage';
import ReviewPage from './pages/review/reviewPage';
import TimelinePage from './pages/timeline/timelinePage';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PrioritiesPage />} />
                <Route path="/priorities" element={<PrioritiesPage />} />
                <Route path="/todo" element={<TodoPage />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes >
        </BrowserRouter >
    );
};

ReacDOM.render(
    <App />, document.getElementById("page_root")
);