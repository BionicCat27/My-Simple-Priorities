import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        //Get auth
        if (location.hostname === "localhost" && location.port === "5001") {
            connectAuthEmulator(auth, "http://localhost:9099");
        }
        //Log in 
        onAuthStateChanged(auth, (userResult) => {
            setUser(userResult);
            console.log((userResult ? "Logged in " : "Not logged in"));
        });
    }, [])

    return (
        <AuthContext.Provider value={{ user, auth }}>{children}</AuthContext.Provider>
    );
}