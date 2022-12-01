//React
import React, { useEffect, useState, useContext } from 'react';
//Firebase
import { ref, onValue, off } from "firebase/database";
//Contexts
import { NavigationContext } from '../../contexts/NavigationContext';
//Components
//Styles
import './viewPage.css';
//Config
import '../../firebaseConfig';
import IndexTable from '../../components/IndexTable/IndexTable';
import { AuthContext } from '../../contexts/AuthContext';
import { DBContext } from '../../contexts/DBContext';

const ViewPage = (props) => {
    const { user } = useContext(AuthContext);
    const { database } = useContext(DBContext);
    const { goToPage, parameters } = useContext(NavigationContext);

    const [dbRef, setDbRef] = useState(undefined);

    const [view, setView] = useState([]);

    const [viewKey] = useState(parameters.objectKey);
    useEffect(() => {
        if (!viewKey) goToPage("#home");
    }, [viewKey]);

    //Set db ref on user set
    useEffect(() => {
        if (user) {
            if (dbRef) {
                off(dbRef);
            }
            setDbRef(ref(database, `users/${user.uid}/views/${viewKey}`));
            setView([]);
        }
    }, [user]);

    //Retrieve cards on dbref change
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
                setView([]);
                return;
            }
            setView(data);
        });
    }, [dbRef]);

    return (
        <div id="pageContent">
            <div id="pageContainer">
                <h1>{view.name}</h1>
                <hr></hr>
            </div>
        </div>
    );
};

export default ViewPage;