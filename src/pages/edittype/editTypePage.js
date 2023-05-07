//React
import React, { useEffect, useState, useContext } from 'react';
//Firebase
//Contexts
import { NavigationContext } from '../../contexts/NavigationContext';
//Components
//Styles
import './editTypePage.css';
//Config
import '../../firebaseConfig';
import { TypesContext } from '../../contexts/TypesContext';
import EditableText from '../../components/EditableText/EditableText';
import IndexTable from '../../components/IndexTable/IndexTable';
import NavMenu from '../../components/NavMenu/NavMenu';
import { useNavigate } from 'react-router';
import EditTypeFieldsList from '../../components/EditTypeFieldsList/EditTypeFieldsList';
import { AuthContext } from '../../contexts/AuthContext';

const EditTypePage = (props) => {
    const { user } = useContext(AuthContext);
    const { parameters } = useContext(NavigationContext);
    const { getType, setTypeValue, keyData } = useContext(TypesContext);

    const [typeKey] = useState(parameters.objectKey);

    const navigate = useNavigate();

    let type = getType(typeKey);
    useEffect(() => {
        if (!typeKey) navigate("/");
    }, [typeKey]);

    if (type == "" || !type) {
        return (
            <div id="pageContent">
                <div id="pageContainer">
                </div>
            </div>
        );
    }
    let fields = [];
    if (type.fields) {
        fields = Object.keys(type.fields).map(key => {
            let field = type.fields[key];
            field.key = key;
            return field;
        });
    }
    console.log(`Fields: ${JSON.stringify(type)}`);


    return (
        <>
            <NavMenu title="Edit Types" />
            <div id="pageContent">
                <div id="pageContainer">
                    <p><b>Title</b></p>
                    <EditableText value={type.name} fieldName="name" element={(content) => <h1>{content}</h1>} changeValue={setTypeValue} dbPath={typeKey} />
                    <hr></hr>
                    <p><b>Description</b></p>
                    <EditableText value={type.description} fieldName="description" element={(content) => <p>{content}</p>} changeValue={setTypeValue} dbPath={typeKey} />
                    <EditTypeFieldsList fields={fields} typeRef={`users/${user?.uid}/types/${typeKey}`} />
                    <hr></hr>
                    <p><b>Data</b></p>
                    <IndexTable datatype={{ name: "Data", field: `types/${typeKey}/data` }} fields={[{ name: "Name", field: "name" }, { name: "Description", field: "description" }]} objects={keyData(type.data) || []} />
                </div>
            </div>
        </>
    );
};

export default EditTypePage;