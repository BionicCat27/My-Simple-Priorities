import React, { useEffect } from "react";
import { getDatabase } from "firebase/database";

export const DBContext = React.createContext();

export const DBProvider = ({ children }) => {
    const database = getDatabase();

    return (
        <DBContext.Provider value={{ database }}>{children}</DBContext.Provider>
    );
};