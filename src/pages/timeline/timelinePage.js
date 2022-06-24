import React, { useEffect, useState, useContext } from 'react';

import './timelinePage.css';

import '../../firebaseConfig';

import { AuthContext } from "../../contexts/AuthContext";

import { getAuth, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";
import { getDatabase, ref, update, onValue, off, connectDatabaseEmulator } from "firebase/database";

//Components
import Sidebar from '../../components/Sidebar';

const database = getDatabase();

if (location.hostname === "localhost" && location.port === "5001") {
    connectDatabaseEmulator(database, "localhost", 9000);
}

const TimelinePage = (props) => {
    const { user } = useContext(AuthContext);

    useEffect(() => {
        console.log("User changed: " + JSON.stringify(user));
    }, [user]);

    return (
        <>
            <div id="pageContent">
                <p>Timeline Page</p>
            </div>
            <Sidebar title={"Timeline"} />
        </>
    );
};

export default TimelinePage;