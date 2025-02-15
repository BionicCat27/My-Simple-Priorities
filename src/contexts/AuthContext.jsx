import React, { useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, connectAuthEmulator, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updatePassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { useCookies } from "react-cookie";
import { auth } from "../firebaseConfig";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(undefined);
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);

    useEffect(()=>{
        setUser(cookies.user);
    }, [cookies])

    function signIn(email, password, errorCallback) {
        if(!auth) return;
        signInWithEmailAndPassword(auth, email, password)
            .catch((error) => errorCallback(`Login Error: ${error.code} - ${error.message}`));
    }

    function signUp(email, password, errorCallback) {
        if(!auth) return;
        createUserWithEmailAndPassword(auth, email, password)
            .catch((error) => errorCallback(`Signup Error: ${error.code} - ${error.message}`));
    }

    function signUserOut(errorCallback) {
        if (!auth) return;
        signOut(auth)
            .catch((error) => errorCallback(`An error occurred during signout: ${error.code} - ${error.message}`));
    }

	function updateUsersPassword(password, errorCallback, successCallback) {
		if (!auth) return;
		updatePassword(auth.currentUser, password)
			.then((result) => successCallback(`Password updated successfully.`))
			.catch((error) => errorCallback(`An error occurred during password update: ${error.code} - ${error.message}`));
	}

    useEffect(() => {
        //Get auth
        if (!auth) return;
        onAuthStateChanged(auth, (userResult) => {
            setLoading(false);
            if(userResult) {
                setCookie('user', userResult)
            } else {
                setCookie('user')
            }
        });
    }, [setCookie, removeCookie]);

    return (
        <AuthContext.Provider value={{ user, loading, auth, signUserOut, signIn, signUp, updateUsersPassword }}>{children}</AuthContext.Provider>
    );
};

export const useAuth = ()=> {
    return useContext(AuthContext);
}
