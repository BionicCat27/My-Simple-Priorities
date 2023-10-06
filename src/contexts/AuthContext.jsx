import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, connectAuthEmulator, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";

export const AuthContext = React.createContext();

const firebaseConfig = {
    apiKey: "AIzaSyD8UFVmCrGkosxreqnQbr4wfe9uDPi4L9w",
    authDomain: "my-simple-priorities.firebaseapp.com",
    databaseURL: "https://my-simple-priorities-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "my-simple-priorities",
    storageBucket: "my-simple-priorities.appspot.com",
    messagingSenderId: "783456794609",
    appId: "1:783456794609:web:1ccfbec5791775a46ab650",
    measurementId: "G-MXL65K2JZC"
};

export const AuthProvider = ({ children }) => {
    const [app, setApp] = useState();
    const [auth, setAuth] = useState();
    const [user, setUser] = useState(null);

    function checkLoggedIn(user) {
        if (!user) {
            loginRedirectIfRestricted();
        }
    }

    function loginRedirectIfRestricted() {
        if (window.location.pathname != "/login" && window.location.pathname != "/signup" && window.location.pathname != "/notfound") {
            window.location = "/login";
        }
    }

    function signIn(email, password, errorCallback) {
        if(!auth) return;
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                window.location = "/";
            })
            .catch((error) => {
                errorCallback("Incorrect username or password.");
            });
    }

    function signUp(email, password, errorCallback) {
        if(!auth) return;
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                window.location = "/";
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
            window.location = "/login";
        }).catch((error) => {
            console.log("An error occurred during signout: " + error);
        });
    }

    useEffect(() => {
        //Get auth
        let initializedApp = initializeApp(firebaseConfig);
        if (import.meta.env.MODE === "development") {
            const hostname = "127.0.0.1";
            connectAuthEmulator(getAuth(), `http://${hostname}:9099`);
            connectDatabaseEmulator(getDatabase(), hostname, 9000);
            console.debug("Development mode enabled, connected to emulators");
        }
        setApp(initializedApp);
        setAuth(getAuth());
        if (!auth) return;
        onAuthStateChanged(auth, (userResult) => {
            setUser(userResult);
            checkLoggedIn(userResult);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ app, user, auth, signUserOut, signIn, signUp }}>{children}</AuthContext.Provider>
    );
};