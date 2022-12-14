//React
import React, { useEffect, useState, useContext } from 'react';
//Firebase
import { ref, onValue, off, update } from "firebase/database";
//Contexts
import { NavigationContext } from '../../contexts/NavigationContext';
//Components
//Styles
import './editTypePage.css';
//Config
import '../../firebaseConfig';
import { AuthContext } from '../../contexts/AuthContext';
import { DBContext } from '../../contexts/DBContext';
import EditableText from '../../components/EditableText/EditableText';

const EditTypePage = (props) => {
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

    function changeValue(fieldName, value) {
        if (dbRef) {
            let updates = {};
            updates[fieldName] = value;

            update(dbRef, updates);
        }
    };

    if (type == "" || !type) {
        return (
            <div id="pageContent">
                <div id="pageContainer">
                </div>
            </div>
        );
    }
    return (
        <div id="pageContent">
            <div id="pageContainer">
                <p><b>Title</b></p>
                <EditableText value={type.name} fieldName="name" dbRef={dbRef} element={(content) => <h1>{content}</h1>} changeValue={changeValue} />
                <hr></hr>
                <p><b>Description</b></p>
                <EditableText value={type.description} fieldName="description" dbRef={dbRef} element={(content) => <p>{content}</p>} changeValue={changeValue} />
            </div>
        </div>
    );
};

export default EditTypePage;