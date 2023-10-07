import React, { useContext, useEffect, useState } from "react";
import { getDatabase, onValue, push, ref, set, get, child, update, remove } from "firebase/database";
import {AuthContext} from "./AuthContext"

export const DBContext = React.createContext();

export const DBProvider = ({ children }) => {
    const { app, user } = useContext(AuthContext);
    const [database, setDatabase] = useState();

    useEffect(()=>{
        if(!app) return;
        setDatabase(getDatabase());
    }, [app])
    
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (user) {
            setReady(true);
        } else {
            setReady(false);
        }
    }, [user])

    const getRef = (path) => {
        if(!path || !database || !user?.uid) {
            return;
        }
        return ref(database, `users/${user.uid}/${path}`)
    }

    const pushObject = (path, object) => {
        let ref = getRef(path);
        if (!ref) return;
        set(push(getRef(path)), object);
    }

    const updateObject = (path, field, value) => {
        let ref = getRef(path);
        if (!ref) return;
        let updateObject = {}
        updateObject[field] = value;
        update(ref, updateObject)
    }

    const removeObject = (path) => {
        let ref = getRef(path);
        if (!ref) return;
        remove(ref)
    }

    const asKeyedList = (data) => {
        if (!data) return;
        let keyedList = Object.keys(data).map(key => {
            let object = data[key];
            object.key = key;
            return object;
        });
        return keyedList;
    }

    const addDataListener = async (path, resultFunction) => {
        let ref = getRef(path);
        if (!ref) return;
        onValue(ref, (snapshot) => {
            let data = snapshot.val();
            data = asKeyedList(data);
            resultFunction(data);
        })
    }

    return (
        <DBContext.Provider value={{
            database,
            ready,
            pushObject,
            updateObject,
            removeObject,
            addDataListener,
            asKeyedList
        }}>{children}</DBContext.Provider>
    );
};