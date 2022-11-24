//React
import React, { useEffect, useState, useContext } from 'react';
//Firebase
import { ref, onValue, off } from "firebase/database";
//Contexts
import { NavigationContext } from '../../contexts/NavigationContext';
//Components
//Styles
import './typePage.css';
//Config
import '../../firebaseConfig';
import IndexTable from '../../components/IndexTable/IndexTable';
import { AuthContext } from '../../contexts/AuthContext';
import { DBContext } from '../../contexts/DBContext';

const TypePage = (props) => {
    const { user } = useContext(AuthContext);
    const { database } = useContext(DBContext);
    const { goToPage, parameters } = useContext(NavigationContext);

    const [dbRef, setDbRef] = useState(undefined);

    const [type, setType] = useState([]);

    const [typeKey] = useState(parameters.objectKey);
    useEffect(() => {
        if (!typeKey) goToPage("#home");
    }, [typeKey]);

    //Set db ref on user set
    useEffect(() => {
        if (user) {
            if (dbRef) {
                off(dbRef);
            }
            setDbRef(ref(database, `users/${user.uid}/types/${typeKey}`));
            setType([]);
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
                setType([]);
                return;
            }
            setType(data);
        });
    }, [dbRef]);

    return (
        <div id="pageContent">
            <div id="pageContainer">
                <h1>{type.name}</h1>
            </div>
        </div>
    );
};

export default TypePage;