import React from 'react';
import ReacDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { initializeApp } from "firebase/app";

//Components
import PriorityPage from './pages/priorityPage.js';
import LoginPage from './pages/loginPage.js';
import SignupPage from './pages/signupPage.js';
import NotFoundPage from './pages/notFoundPage.js';

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
const app = initializeApp(firebaseConfig);

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