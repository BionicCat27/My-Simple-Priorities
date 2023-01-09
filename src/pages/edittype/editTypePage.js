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
import { TypesContext } from '../../contexts/TypesContext';
import EditableText from '../../components/EditableText/EditableText';

const EditTypePage = (props) => {
    const { user } = useContext(AuthContext);
    const { database } = useContext(DBContext);
    const { navigateToPage, parameters } = useContext(NavigationContext);

    const { getType, setTypeValue } = useContext(TypesContext);

    const [dbRef, setDbRef] = useState(undefined);

    // const [type, setType] = useState([]);

    const [typeKey] = useState(parameters.objectKey);

    let type = getType(typeKey);
    useEffect(() => {
        if (!typeKey) navigateToPage("#home");
    }, [typeKey]);

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
                <EditableText value={type.name} fieldName="name" dbRef={dbRef} element={(content) => <h1>{content}</h1>} changeValue={setTypeValue} parentKey={typeKey} />
                <hr></hr>
                <p><b>Description</b></p>
                <EditableText value={type.description} fieldName="description" dbRef={dbRef} element={(content) => <p>{content}</p>} changeValue={setTypeValue} parentKey={typeKey} />
            </div>
        </div>
    );
};

export default EditTypePage;