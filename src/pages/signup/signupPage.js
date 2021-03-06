import React, { useState } from 'react';

import './signupPage.css';

import '../../firebaseConfig';

import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";

//Components
import PageTitle from '../../components/PageTitle';
import Footer from '../../components/Footer';

const auth = getAuth();
if (location.hostname === "localhost" && location.port === "5001") {
    connectAuthEmulator(auth, "http://localhost:9099");
}

const SignupPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    onAuthStateChanged(auth, (userResult) => {
        if (userResult) {
            window.location = "/";
        }
    });

    function prepareCreateAccount(event) {
        event.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                window.location = "/";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Authentication Error: " + errorCode + " - " + errorMessage);
            });
    }

    return (
        <div className="main-content">
            <div className="text-center div-card vertical-center">
                <PageTitle title="Signup" />
                <form id="signupForm" onSubmit={prepareCreateAccount}>
                    <input id="signupFormEmail" className="signupFormElement" type="email" value={email} onChange={field => setEmail(field.target.value)}></input>
                    <input id="signupFormPassword" className="signupFormElement" type="password" value={password} onChange={field => setPassword(field.target.value)}></input>
                    <button onClick={prepareCreateAccount}>Create Account</button>
                </form>
                <p>Or <a href="/login">Login</a></p>
            </div>
            <Footer />
        </div>
    );
};

export default SignupPage;