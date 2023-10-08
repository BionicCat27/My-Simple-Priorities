import { getDatabase, onValue, push, ref, remove, set, update } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const DBContext = React.createContext();

export const DBProvider = ({ children }) => {
    const [database, setDatabase] = useState();
    const { user } = useContext(AuthContext);
    const [ready, setReady] = useState(false);

    useEffect(()=> {
        setDatabase(getDatabase());
    }, [database])

    useEffect(() => {
        if (user && database) {
            setReady(true);
        } else {
            setReady(false);
        }
    }, [user, database])

    const getRef = (path) => {
        return ref(database, `users/${user.uid}/${path}`)
    }

    const pushObject = (path, object) => {
        if(!ready) return;
        set(push(getRef(path)), object);
    }

    const updateObject = (path, field, value) => {
        if(!ready) return;
        let updateObject = {}
        updateObject[field] = value;
        update(getRef(path), updateObject)
    }

    const removeObject = (path) => {
        if(!ready) return;
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

    const addDataListener = async (path, resultFunction) => {
        if(!ready) return;
        onValue(getRef(path), (snapshot) => {
            let data = snapshot.val();
            data = asKeyedList(data);
            resultFunction(data);
        })
    }

    return (
        <DBContext.Provider value={{
            ready,
            pushObject,
            updateObject,
            removeObject,
            addDataListener,
            asKeyedList
        }}>{children}</DBContext.Provider>
    );
};