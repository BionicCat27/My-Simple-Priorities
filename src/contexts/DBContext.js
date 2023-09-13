import React, { useContext, useEffect, useState } from "react";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import {AuthContext} from "./AuthContext"

export const DBContext = React.createContext();

export const DBProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const database = getDatabase();

    const addData = (path, object) => {
        if(!(user?.uid)) return;
        console.log(JSON.stringify(object))
        set(push(ref(database, `${user.uid}/${path}`)), object);
    }

    return (
        <DBContext.Provider value={{
            database,
            addData
        }}>{children}</DBContext.Provider>
    );
};