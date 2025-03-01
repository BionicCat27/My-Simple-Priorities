//React
import React, { useState, useContext, useEffect } from 'react';
//Contexts
//Components
//Styles
import PageTitle from './components/PageTitle';
import Footer from './components/Footer';
import { useNavigate } from 'react-router';
import { AuthContext } from '../contexts/AuthContext';

const LoginPage = () => {
    const { signIn, user } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    function prepareSignIn(event) {
        event.preventDefault();
        signIn(email, password, setErrorMessage);
    }

    return (
        <div className="main-content">
            <div className="text-center vertical-center">
                <h1 className='text-center'>Welcome back,</h1>
                <h2 className='text-center'>Login to manage your priorities!</h2>
                <form id="centeredForm" onSubmit={prepareSignIn}>
                    <input id="loginFormEmail" className="centeredFormElement" type="email" value={email} onChange={field => setEmail(field.target.value)}></input>
                    <input id="loginFormPassword" className="centeredFormElement" type="password" value={password} onChange={field => setPassword(field.target.value)}></input>
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
