//React
import React, { useState, useContext, useEffect } from 'react';
//Contexts
import { AuthContext } from "../../contexts/AuthContext";
//Components
//Styles
import './loginPage.css';
import PageTitle from '../components/PageTitle';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router';

const LoginPage = () => {
    const { signIn, user } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    function prepareSignIn(event) {
        event.preventDefault();
        signIn(email, password, setErrorMessage);
    }

    useEffect(()=> {
        if(!user) return;
        navigate("/");
    }, [user]);

    return (
        <div className="main-content">
            <div className="text-center div-card vertical-center">
                <PageTitle title="Login" />
                <form id="loginForm" onSubmit={prepareSignIn}>
                    <input id="loginFormEmail" className="loginFormElement" type="email" value={email} onChange={field => setEmail(field.target.value)}></input>
                    <input id="loginFormPassword" className="loginFormElement" type="password" value={password} onChange={field => setPassword(field.target.value)}></input>
                    <button id="loginButton" onClick={prepareSignIn}>Login</button>
                </form>
                {errorMessage ? <p id="login-error-message">{errorMessage}</p> : null}
                <p>Or <a href="/signup">Signup</a></p>
            </div>
            <Footer />
        </div>
    );
};

export default LoginPage;