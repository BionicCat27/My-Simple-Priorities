//React
import React, { useState, useContext, useEffect } from 'react';
//Contexts
//Components
//Styles
import Footer from './components/Footer';
import { useNavigate } from 'react-router';
import { AuthContext } from '../contexts/AuthContext';

const LandingPage = () => {
    const { signIn, signUp, user } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    function prepareSignIn(event) {
        event.preventDefault();
        signIn(email, password, setErrorMessage);
    }

    function prepareCreateAccount(event) {
        event.preventDefault();
        signUp(email, password, setErrorMessage);
    }

    useEffect(() => {
        if (!user) return;
        navigate("/");
    }, [user]);

    return (
        <div className="flex flex-row place-content-center h-screen bg-red-500">
            <div className='basis-1/2 bg-green-400 h-full'>
                <h2 className='text-center'>Priorities and Productivity.</h2>
            </div>
            <div className="basis-1/2 bg-blue-400">
                <form className='flex flex-col' onSubmit={prepareSignIn}>
                    <input id="loginFormEmail" placeholder={"Username"} className="centeredFormElement" type="email" value={email} onChange={field => setEmail(field.target.value)}></input>
                    <input id="loginFormPassword" placeholder={"Password"} className="centeredFormElement" type="password" value={password} onChange={field => setPassword(field.target.value)}></input>
                    <div className='flex flex-row '>
                        <button onClick={prepareSignIn}>Login</button>
                        <p>or</p>
                        <button className="quiet-button" onClick={prepareCreateAccount}>Signup</button>
                        {errorMessage ? <p id="login-error-message" >{errorMessage}</p> : null}
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default LandingPage;