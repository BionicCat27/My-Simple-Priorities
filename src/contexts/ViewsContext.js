import { off, onValue, ref, update } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { DBContext } from "./DBContext";

export const ViewsContext = React.createContext();

export const ViewsProvider = ({ children }) => {

    const { user } = useContext(AuthContext);
    const { database } = useContext(DBContext);

    const [dbRef, setDbRef] = useState(undefined);

    const [viewsData, setViewsData] = useState();
    const [rawViewsData, setRawViewsData] = useState();

    //Set db ref on user set
    useEffect(() => {
        if (user) {
            if (dbRef) {
                off(dbRef);
            }
            setDbRef(ref(database, `users/${user.uid}/views`));
            setViewsData([]);
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
                setViewsData([]);
                return;
            }
            setRawViewsData(data);
            let keyedData = Object.keys(data).map((key) => {
                let value = data[key];
                value.key = key;
                return value;
            });
            setViewsData(keyedData);
        });
    }, [dbRef]);

    function getView(viewKey) {
        if (!viewKey) {
            return;
        }
        let view = rawViewsData[viewKey];
        if (!view) {
            return;
        }
        view.key = viewKey;
        return view;
    }

    function setViewValue(viewKey, fieldName, value) {
        if (dbRef) {
            let updates = {};
            updates[fieldName] = value;

            update(ref(database, `users/${user.uid}/views/${viewKey}`), updates);
        }
    };

    return (
        <ViewsContext.Provider value={{
            viewsData,
            getView,
            setViewValue
        }}>{children}</ViewsContext.Provider>
    );
};;