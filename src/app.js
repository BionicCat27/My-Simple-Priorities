import React from 'react';
import ReacDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './firebaseConfig';

//Components
import PriorityPage from './pages/priorityPage.js';
import LoginPage from './pages/loginPage.js';
import SignupPage from './pages/signupPage.js';
import NotFoundPage from './pages/notFoundPage.js';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PriorityPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

ReacDOM.render(
    <App />, document.getElementById("page_root")
);