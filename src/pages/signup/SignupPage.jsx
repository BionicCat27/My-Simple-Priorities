//React
import React, { useState, useContext } from 'react';
//Firebase
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
//Contexts
import { AuthContext } from "../../contexts/AuthContext";
//Components
//Styles
import './signupPage.css';
import PageTitle from '../components/PageTitle';
import Footer from '../components/Footer';

const SignupPage = () => {
    const {auth, signUp} = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function prepareCreateAccount(event) {
        event.preventDefault();
        signUp(email, password, ()=>{});
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