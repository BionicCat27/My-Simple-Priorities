import React, { useState } from 'react';

import '../firebaseConfig';

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

//Components
import PageTitle from '../components/PageTitle';
import Description from '../components/Description';
import Footer from '../components/Footer';

const auth = getAuth();

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function prepareSignIn(event) {
        event.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
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
                <PageTitle title="Login" />
                <form id="loginForm">
                    <input id="loginFormEmail" className="loginFormElement" type="email" value={email} onChange={field => setEmail(field.target.value)}></input>
                    <input id="loginFormPassword" className="loginFormElement" type="password" value={password} onChange={field => setPassword(field.target.value)}></input>
                    <button onClick={prepareSignIn}>Login</button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default LoginPage;