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
        <div className="flex flex-col justify-content items-center place-content-center h-screen p-10">
			<h1 className="text-xl">My Simple Priorities</h1>
            <div className="mt-8 rounded-md shadow-md p-8">
                <h2 className='text-center text-xl'>Priorities and Productivity.</h2>
                <span className='text-center'>Manage your notes, tasks and time.</span>
                <form className='flex flex-col justify-center items-center mt-4' onSubmit={prepareSignIn}>
                    <input id="loginFormEmail" placeholder={"Username"} className="centeredFormElement bg-opacity-50 bg-gray-300 hover:bg-gray-100 focus:bg-gray-100 rounded p-1" type="email" value={email} onChange={field => setEmail(field.target.value)}></input>
                    <input id="loginFormPassword" placeholder={"Password"} className="centeredFormElement bg-opacity-50 bg-gray-300 hover:bg-gray-100 focus:bg-gray-100 rounded p-1" type="password" value={password} onChange={field => setPassword(field.target.value)}></input>
                    <div className='flex flex-row items-center'>
                        <button className='mr-2 underline hover:no-underline underline-offset-2 border border-transparent rounded py-1 px-2 hover:border-black hover:bg-white hover:bg-opacity-50' onClick={prepareSignIn}>Login</button>
                        <p>or</p>
                        <button className="ml-2 underline hover:no-underline underline-offset-2 border border-transparent rounded py-1 px-2 hover:border-black hover:bg-white hover:bg-opacity-50" onClick={prepareCreateAccount}>Signup</button>
                    </div>
                    {errorMessage ? <p className='font-semibold text-red-900 border rounded p-2 mt-2' id="login-error-message" >{errorMessage}</p> : null}
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default LandingPage;
