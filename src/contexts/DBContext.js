import React, { useContext, useEffect, useState } from "react";
import { getDatabase, onValue, push, ref, set, get, child } from "firebase/database";
import {AuthContext} from "./AuthContext"

export const DBContext = React.createContext();

export const DBProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const database = getDatabase();
    
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (user) {
            setReady(true);
        } else {
            setReady(false);
        }
    }, [user])

    const getRef = (path) => {
        return ref(database, `${user.uid}/${path}`)
    }

    const pushObject = (path, object) => {
        if(!(user?.uid)) return;
        console.log(JSON.stringify(object))
        set(push(getRef(path)), object);
    }

    const getData = (path) => {
        get(getRef(path)).then((snapshot) =>{
            if(snapshot.exists()) {
                return snapshot.val()
            }
        });
    }

    const addDataListener = async (path, resultFunction) => {
        onValue(getRef(path), (snapshot) => {
            const data = snapshot.val();
            resultFunction(data);
        })
    }

    return (
        <DBContext.Provider value={{
            database,
            ready,
            pushObject,
            addDataListener
        }}>{children}</DBContext.Provider>
    );
};