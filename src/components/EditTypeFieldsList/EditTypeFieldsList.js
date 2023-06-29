//React
import { push, ref, set } from 'firebase/database';
import React, { useContext, useEffect, useState } from 'react';
import { DBContext } from '../../contexts/DBContext';
import FieldSelector from './FieldSelector/FieldSelector';
import EditableField from './EditableField/EditableField';
const EditTypeFieldsList = (props) => {
    const { database } = useContext(DBContext);

    const [fields, setFields] = useState(props.fields);
    const typeRef = props.typeRef;

    useEffect(() => { setFields(props.fields); }, [props.fields]);


    function addField(fieldKey) {
        let obj = { field: fieldKey };
        if (fieldKey === "indexField") {
            obj["title"] = "Index";
        }

        let res = set(push(ref(database, `${typeRef}/fields/`)), obj);
    }

    if (!typeRef) {
        return <p>Error: no typeRef</p>;
    }
    if (!fields || fields.length == 0) {
        return (
            <>
                <p><b>Fields</b></p>
                <FieldSelector addField={addField} />
            </>
        );
    }
    if (!fields.length) {
        // One field exists
        let field = fields;
        return (
            <>
                <p><b>Fields</b></p>
                <FieldSelector addDisplay={addField} hasIndex={field.field === "indexField"} />
                <EditableField field={field} fieldRef={`${typeRef}/fields/${field.key}`} />
            </>
        );
    }
    let hasIndex = false;
    for (let i = 0; i < fields.length; i++) {
        if (fields[0]?.field === "indexField") {
            hasIndex = true;
        }
    }
    return (
        <>
            <h2>Fields</h2>
            <FieldSelector addField={addField} hasIndex={hasIndex} />
            {fields.map((field, index) => {
                return <EditableField key={`${index}${JSON.stringify(field.field)}`} field={field} fieldRef={`${typeRef}/fields/${field.key}`} />;
            })}
        </>
    );
};

export default EditTypeFieldsList;