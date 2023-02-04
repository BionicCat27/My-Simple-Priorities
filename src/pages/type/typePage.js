//React
import React, { useEffect, useState, useContext } from 'react';
//Firebase
//Contexts
import { NavigationContext } from '../../contexts/NavigationContext';
//Components
//Styles
import './typePage.css';
//Config
import '../../firebaseConfig';
import IndexTable from '../../components/IndexTable/IndexTable';
import { TypesContext } from '../../contexts/TypesContext';

const TypePage = (props) => {
    const { navigateToPage, parameters } = useContext(NavigationContext);
    const { getType, keyData } = useContext(TypesContext);

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

    return (
        <div id="pageContent">
            <div id="pageContainer">
                <h1>{type.name}</h1>
                <hr></hr>
                <IndexTable datatype={{ name: "Data", field: `types/${typeKey}/data` }} fields={[{ name: "Name", field: "name" }, { name: "Description", field: "description" }]} objects={keyData(type.data) || []} />
            </div>
        </div>
    );
};

export default TypePage;