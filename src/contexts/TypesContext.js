import { off, onValue, ref } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { DBContext } from "./DBContext";

export const TypesContext = React.createContext();

export const TypesProvider = ({ children }) => {

    const { user } = useContext(AuthContext);
    const { database } = useContext(DBContext);

    const [dbRef, setDbRef] = useState(undefined);

    const [typesData, setTypesData] = useState();
    const [rawTypesData, setRawTypesData] = useState();

    //Set db ref on user set
    useEffect(() => {
        if (user) {
            if (dbRef) {
                off(dbRef);
            }
            setDbRef(ref(database, `users/${user.uid}/types`));
            setTypesData([]);
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
                setTypesData([]);
                return;
            }
            setRawTypesData(data);
            let keyedData = Object.keys(data).map((key) => {
                let value = data[key];
                value.key = key;
                return value;
            });
            setTypesData(keyedData);
        });
    }, [dbRef]);

    function getType(typeKey) {
        let type = rawTypesData[typeKey];
        type.key = typeKey;
        return type;
    }

    return (
        <TypesContext.Provider value={{
            typesData,
            getType
        }}>{children}</TypesContext.Provider>
    );
};;