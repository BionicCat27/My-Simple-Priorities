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
import { TypesContext } from '../../contexts/TypesContext';

const TypePage = (props) => {
    const { user } = useContext(AuthContext);
    const { database } = useContext(DBContext);
    const { navigateToPage, parameters } = useContext(NavigationContext);
    const { getType } = useContext(TypesContext);

    const [dbRef, setDbRef] = useState(undefined);

    // const [type, setType] = useState([]);

    const [typeKey] = useState(parameters.objectKey);

    let type = getType(typeKey);
    useEffect(() => {
        if (!typeKey) navigateToPage("#home");
    }, [typeKey]);

    if (!type) {
        return (
            <p>No type found.</p>
        );
    }

    function keyData(data) {
        if (!data) {
            return [];
        }
        let keyedData = Object.keys(data).map((key) => {
            let value = data[key];
            value.key = key;
            return value;
        });
        return keyedData;
    }

    return (
        <div id="pageContent">
            <div id="pageContainer">
                <h1>{type.name}</h1>
                <hr></hr>
                <IndexTable datatype={{ name: "Data", field: `types/${typeKey}/data`, target: "data" }} fields={[{ name: "Name", field: "name" }, { name: "Description", field: "description" }]} objects={keyData(type.data) || []} />
            </div>
        </div>
    );
};

export default TypePage;