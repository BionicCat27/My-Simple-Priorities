import React from 'react';
import ReacDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Components
import Footer from './components/Footer.js';
import Description from './components/Description.js';
import PriorityPage from './pages/priorityPage.js';
import LoginPage from './pages/loginPage.js';
import NotFoundPage from './pages/notFoundPage.js';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PriorityPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Description />
            <Footer />
        </BrowserRouter>
    )
}

ReacDOM.render(
    <App />, document.getElementById("page_root")
)