import React from 'react';
import ReacDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './firebaseConfig';

//Components
import ContentPage from './pages/contentPage.js';
import LoginPage from './pages/loginPage.js';
import SignupPage from './pages/signupPage.js';
import NotFoundPage from './pages/notFoundPage.js';
import TimelinePage from './pages/timelinePage';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ContentPage contentType="priorities" />} />
                <Route path="/priorities" element={<ContentPage contentType="priorities" />} />
                <Route path="/todo" element={<ContentPage contentType="todo" />} />
                <Route path="/review" element={<ContentPage contentType="review" />} />
                <Route path="/timeline" element={<TimelinePage/>} />
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