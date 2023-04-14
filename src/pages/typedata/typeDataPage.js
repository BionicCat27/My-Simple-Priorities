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
import EditableText from '../../components/EditableText/EditableText';

const TypeDataPage = (props) => {
    const { navigateToPage, parameters } = useContext(NavigationContext);
    const { getType, setTypeValue } = useContext(TypesContext);

    const [typeKey] = useState(parameters.typeKey);
    const [dataKey] = useState(parameters.dataKey);

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

    let typeChildren = type.data;
    let targetTypeData = typeChildren[dataKey];

    return (
        <div id="pageContent">
            <div id="pageContainer">
                <hr></hr>
                <p><b>Title</b></p>
                <EditableText value={targetTypeData.name} fieldName="name" element={(content) => <h1>{content}</h1>} changeValue={setTypeValue} dbPath={`${typeKey}/data/${dataKey}`} />
                <hr></hr>
                <p><b>Description</b></p>
                <EditableText value={targetTypeData.description} fieldName="description" element={(content) => <p>{content}</p>} changeValue={setTypeValue} dbPath={`${typeKey}/data/${dataKey}`} />
            </div>
        </div>
    );
};

export default TypeDataPage;