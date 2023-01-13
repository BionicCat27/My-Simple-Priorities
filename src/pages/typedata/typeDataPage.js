//React
import React, { useEffect, useState, useContext } from 'react';
//Firebase
//Contexts
//Components
//Styles
//Config
import '../../firebaseConfig';
import { NavigationContext } from '../../contexts/NavigationContext';
import { TypesContext } from '../../contexts/TypesContext';

const TypeDataPage = (props) => {
    const { navigateToPage, parameters } = useContext(NavigationContext);
    const { getType } = useContext(TypesContext);

    const [typeKey] = useState(parameters.objectKey);

    let type = getType(typeKey);

    if (!type) {
        return (
            <div id="pageContent">
                <div id="pageContainer">
                    <p>No type found.</p>
                </div>
            </div >
        );
    }

    return (
        <div id="pageContent">
            <div id="pageContainer">
                <h1>{type.name}</h1>
                <hr></hr>
            </div>
        </div>
    );
};

export default TypeDataPage;