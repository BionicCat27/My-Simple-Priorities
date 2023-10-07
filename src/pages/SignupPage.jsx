//React
import React, { useState, useContext, useEffect } from 'react';
//Firebase
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
//Contexts
//Components
//Styles
import PageTitle from './components/PageTitle';
import Footer from './components/Footer';
import { useNavigate } from 'react-router';
import { AuthContext } from '../contexts/AuthContext';

const SignupPage = () => {
    const {user, signUp} = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    function prepareCreateAccount(event) {
        event.preventDefault();
        signUp(email, password, ()=>{});
    }

    useEffect(()=> {
        if(!user) return;
        navigate("/");
    }, [user]);


    return (
        <div className="main-content">
            <div className="text-center div-card vertical-center">
                <PageTitle title="Signup" />
                <form id="centeredForm" onSubmit={prepareCreateAccount}>
                    <input id="signupFormEmail" className="centeredFormElement" type="email" value={email} onChange={field => setEmail(field.target.value)}></input>
                    <input id="signupFormPassword" className="centeredFormElement" type="password" value={password} onChange={field => setPassword(field.target.value)}></input>
                    <button onClick={prepareCreateAccount}>Create Account</button>
                </form>
                <p>Or <a href="/login">Login</a></p>
            </div>
            <Footer />
        </div>
    );
};

export default SignupPage;