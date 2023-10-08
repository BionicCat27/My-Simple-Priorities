import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, connectAuthEmulator, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { useCookies } from "react-cookie";
import { auth } from "../firebaseConfig";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [cookies, setCookie] = useCookies(["user"]);
    const [user, setUser] = useState();

    useEffect(()=>{
        setUser(cookies?.user);
    }, [cookies])

    function signIn(email, password, errorCallback) {
        if(!auth) return;
        signInWithEmailAndPassword(auth, email, password)
            .then((userResult) => {
                setCookie("user", userResult)
            })
            .catch((error) => {
                errorCallback("Incorrect username or password.");
            });
    }

    function signUp(email, password, errorCallback) {
        if(!auth) return;
        createUserWithEmailAndPassword(auth, email, password)
            .then((userResult) => {
                setCookie("user", userResult)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                errorCallback("Authentication Error: " + errorCode + " - " + errorMessage);
            });
    }

    function signUserOut() {
        if (!auth) return;
        signOut(auth).then(() => {
            setCookie("user", undefined)
        }).catch((error) => {
            console.log("An error occurred during signout: " + error);
        });
    }

    useEffect(() => {
        //Get auth
        if (!auth) return;
        onAuthStateChanged(auth, (userResult) => {
            setCookie("user", userResult)
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, auth, signUserOut, signIn, signUp }}>{children}</AuthContext.Provider>
    );
};