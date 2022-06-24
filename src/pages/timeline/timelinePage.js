//React
import React, { useEffect, useState, useContext } from 'react';
//Firebase
import { getAuth, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";
import { getDatabase, ref, update, onValue, off, connectDatabaseEmulator } from "firebase/database";
//Contexts
import { AuthContext } from "../../contexts/AuthContext";
import { DBContext } from '../../contexts/DBContext';
//Components
import Sidebar from '../../components/Sidebar';
//Styles
import './timelinePage.css';
//Config
import '../../firebaseConfig';

const TimelinePage = (props) => {
    const { user } = useContext(AuthContext);
    const database = useContext(DBContext);

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