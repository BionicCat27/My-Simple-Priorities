import { off, onValue, ref } from "firebase/database";
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
        let view = rawViewsData[viewKey];
        view.key = viewKey;
        return view;
    }

    return (
        <ViewsContext.Provider value={{
            viewsData,
            getView
        }}>{children}</ViewsContext.Provider>
    );
};;