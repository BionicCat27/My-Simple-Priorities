import React, { useEffect } from "react";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

export const DBContext = React.createContext();

export const DBProvider = ({ children }) => {
    const database = getDatabase();

    useEffect(() => {
        //Get db
        if (location.hostname === "localhost" && location.port === "5001") {
            connectDatabaseEmulator(database, "localhost", 9000);
        }
    }, []);

    return (
        <DBContext.Provider value={{ database }}>{children}</DBContext.Provider>
    );
};