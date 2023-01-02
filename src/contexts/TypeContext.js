import { off, onValue, ref } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { DBContext } from "./DBContext";

export const TypeContext = React.createContext();

export const TypeProvider = ({ children, user, typeKey }) => {

    const { database } = useContext(DBContext);

    const [dbRef, setDbRef] = useState(undefined);

    const [typeData, setTypeData] = useState();

    //Set db ref on user set
    useEffect(() => {
        if (user) {
            if (dbRef) {
                off(dbRef);
            }
            setDbRef(ref(database, `users/${user.uid}/types/${typeKey}`));
            setTypeData([]);
        }
    }, [user]);

    useEffect(() => {
        if (!dbRef) {
            return;
        }
        if (!user) {
            console.log("Can't load content - no user found.");
            return;
        }
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data == null) {
                console.log("An error occurred.");
                setTypeData([]);
                return;
            }
            setTypeData(data);
        });
    }, [dbRef]);

    return (
        <TypeContext.Provider value={{
            typeData
        }}>{children}</TypeContext.Provider>
    );
};;