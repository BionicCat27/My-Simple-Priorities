//React
import { map } from '@firebase/util';
import { push, ref, set, update } from 'firebase/database';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { DBContext } from '../../contexts/DBContext';
//Components
const IndexTableFormRow = (props) => {
    const authContext = useContext(AuthContext);
    const { database } = useContext(DBContext);
    const user = authContext.user;

    const datatype = props.datatype;
    const fields = props.fields;

    let initialMap = new Map();
    fields.forEach(field => {
        initialMap.set(field.field, "");
    });

    const [fieldValues, setFieldValues] = useState(initialMap);

    const setFieldValue = (object, field, value) => {
        let fieldValueCopy = new Map(object);
        fieldValueCopy.set(field, value);
        return fieldValueCopy;
    };

    function addObject() {
        let obj = Object.fromEntries(fieldValues);
        let res = set(push(ref(database, `users/${user.uid}/${datatype.field}`)), obj);

        let fieldBuild = fieldValues;
        fields.forEach((field) => {
            console.log(field.field);
            fieldBuild = setFieldValue(fieldBuild, field.field, "");
        });
        setFieldValues(fieldBuild);
    };

    const handleKeyDown = (event) => {
        if (event.key == 'Enter') {
            addObject();
        }
    };

    return (
        <tr>
            {fields.map((field) => {
                return <td key={field.name}>
                    <input
                        placeholder={field.name}
                        value={fieldValues.get(field.field)}
                        onChange={change => setFieldValues(setFieldValue(fieldValues, field.field, change.target.value))}
                        onKeyDown={handleKeyDown}>
                    </input>
                </td>;
            })}
            <td><button onClick={addObject}>Add</button></td>
        </tr>
    );
};

export default IndexTableFormRow;