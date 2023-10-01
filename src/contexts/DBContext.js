import React, { useContext, useEffect, useState } from "react";
import { getDatabase, onValue, push, ref, set, get, child, update, remove } from "firebase/database";
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
        return ref(database, `users/${user.uid}/${path}`)
    }

    const pushObject = (path, object) => {
        if(!(user?.uid)) return;
        set(push(getRef(path)), object);
    }

    const updateObject = (path, field, value) => {
        if(!(user?.uid)) return;
        let updateObject = {}
        updateObject[field] = value;
        update(getRef(path), updateObject)
    }

    const removeObject = (path) => {
        if(!(user?.uid)) return;
        remove(getRef(path))
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

    const getData = (path) => {
        get(getRef(path)).then((snapshot) =>{
            if(snapshot.exists()) {
                return snapshot.val()
            }
        });
    }

    const addDataListener = async (path, resultFunction) => {
        onValue(getRef(path), (snapshot) => {
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