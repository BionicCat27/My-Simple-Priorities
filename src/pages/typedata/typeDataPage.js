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
import NavMenu from '../../components/NavMenu/NavMenu';

const TypeDataPage = (props) => {
    const { parameters, navigateBack } = useContext(NavigationContext);
    const { getType, setTypeValue, removeTypeValue, keyData } = useContext(TypesContext);
    const [fieldDbRef, setFieldDbRef] = useState(undefined);

    const [typeKey] = useState(parameters.typeKey);
    const [dataKey] = useState(parameters.dataKey);

    let dataRef = `${typeKey}/data/${dataKey}`;

    let type = getType(typeKey);

    console.log(`Type: ${JSON.stringify(type)}`);

    if (!type) {
        return (
            <div id="pageContent">
                <div id="pageContainer">
                    <p>No type found.</p>
                </div>
            </div >
        );
    }

    let typeFields;
    if (type?.fields) {
        typeFields = keyData(type.fields);
    }

    let typeChildren = type.data;
    let targetTypeData = typeChildren[dataKey];

    if (!targetTypeData) {
        navigateBack();

        return (
            <div id="pageContent">
                <div id="pageContainer">
                    <p>No type data found.</p>
                </div>
            </div >
        );
    }

    function setFieldValue(dataPath, fieldName, value) {
        setTypeValue(dataRef + "/fields", fieldName, value);
    }

    function renderFields() {
        if (typeFields) {
            return typeFields.map((field) => {
                let fieldValue = "";
                if (targetTypeData?.fields) {
                    fieldValue = targetTypeData.fields[field.key];
                }
                return (
                    <div key={`${field.key}-container`}>
                        <h3 key={`${field.key}-title`} >{field.title}</h3>
                        <EditableText key={`${field.key}-field`} value={fieldValue} fieldName={field.key} element={(content) => <h3>{content}</h3>} changeValue={setFieldValue} dbPath={""} />
                    </div>
                );
            });
        }
    }

    function removeData() {
        removeTypeValue(dataRef);
        console.log("Removing type value...");
        navigateBack();
        console.log("Navigating away!");
    }

    return (
        <>
            <NavMenu title="Type Data" />
            <div id="pageContent">
                <div id="pageContainer">
                    <hr></hr>
                    <p><b>Title</b></p>
                    <EditableText value={targetTypeData.name} fieldName="name" element={(content) => <h1>{content}</h1>} changeValue={setTypeValue} dbPath={`${typeKey}/data/${dataKey}`} />
                    <hr></hr>
                    <p><b>Description</b></p>
                    <EditableText value={targetTypeData.description} fieldName="description" element={(content) => <p>{content}</p>} changeValue={setTypeValue} dbPath={`${typeKey}/data/${dataKey}`} />
                    <p><b>Fields</b></p>
                    {renderFields()}
                    <hr></hr>
                    <p className={"clickable remove_button"} onClick={() => removeData()}>Remove</p>
                </div>
            </div>
        </>
    );
};

export default TypeDataPage;