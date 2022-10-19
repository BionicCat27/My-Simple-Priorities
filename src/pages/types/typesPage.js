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
import TimelineGantt from '../../components/TimelineGantt/TimelineGantt';
//Styles
import './typesPage.css';
//Config
import '../../firebaseConfig';
import TypesTable from '../../components/TypesTable/TypesTable';

const TypesPage = (props) => {
    const { user } = useContext(AuthContext);
    const { database } = useContext(DBContext);

    const [dbRef, setDbRef] = useState(undefined);

    const [types, setTypes] = useState([]);

    //Set db ref on user set
    useEffect(() => {
        if (user) {
            if (dbRef) {
                off(dbRef);
            }
            setDbRef(ref(database, `users/${user.uid}/types`));
            setTypes([]);
        }
    }, [user]);

    //Retrieve cards on dbref change
    useEffect(() => {
        if (!dbRef) {
            console.log("Not logged in/no type");
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
                setTypes([]);
                return;
            }
            setTypes(Object.values(data));
        });
    }, [dbRef]);
    return (
        <div id="pageContent">
            <div id="pageContainer">
                <h1>Types</h1>
                <TypesTable types={types} />
            </div>
        </div>
    );
};

export default TypesPage;