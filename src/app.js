import React from 'react';
import ReacDOM from 'react-dom';
import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';

import Footer from './components/Footer.js';
import Description from './components/Description.js';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PriorityPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    )
}

const PriorityPage = () => {
    return (
        < div >
            <h1 id="PageTitle" className="text-center">My Simple Priorities</h1>
            <div id="PriorityContent" className="div-card main-content">
                <p>My Priorities</p>
                <input type="text" id="PriorityField" />
                <button id="PriorityButton">Add priority!</button>
                <div id="PrioritiesBlock">
                </div>
            </div>
            <Description />
        </div >
    )
}

const LoginPage = () => {
    return (
        <div>Login</div>
    )
}

const NotFoundPage = () => {
    return (<div>Not Found</div>)
}

ReacDOM.render(
    <App />, document.getElementById("page_root")
)