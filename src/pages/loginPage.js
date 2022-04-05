import React, { useState } from 'react';

import './loginPage.css';

import '../firebaseConfig';

import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";

//Components
import PageTitle from '../components/PageTitle';
import Footer from '../components/Footer';

const auth = getAuth();
if (location.hostname === "localhost" && location.port === "5001") {
    connectAuthEmulator(auth, "http://localhost:9099");
}

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    onAuthStateChanged(auth, (userResult) => {
        if (userResult) {
            window.location = "/";
        }
    });

    function prepareSignIn(event) {
        event.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                window.location = "/";
            })
            .catch((error) => {
                setErrorMessage("Incorrect username or password.");
            });
    }

    return (
        <div className="main-content">
            <div className="text-center div-card vertical-center">
                <PageTitle title="Login" />
                <form id="loginForm" onSubmit={prepareSignIn}>
                    <input id="loginFormEmail" className="loginFormElement" type="email" value={email} onChange={field => setEmail(field.target.value)}></input>
                    <input id="loginFormPassword" className="loginFormElement" type="password" value={password} onChange={field => setPassword(field.target.value)}></input>
                    <button id="loginButton" onClick={prepareSignIn}>Login</button>
                </form>
                {errorMessage != null ? <p>{errorMessage}</p> : null}
                <p>Or <a href="/signup">Signup</a></p>
            </div>
            <Footer />
        </div>
    );
};

export default LoginPage;