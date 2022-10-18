//React
import { push, ref, set, update } from 'firebase/database';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { DBContext } from '../../../contexts/DBContext';
//Components
const TypesTableFormRow = (props) => {
    const authContext = useContext(AuthContext);
    const { database } = useContext(DBContext);
    const user = authContext.user;

    const [typeName, setTypeName] = useState("");
    const [typeDescription, setTypeDescription] = useState("");

    function addType(event) {
        event.preventDefault();
        set(push(ref(database, 'users/' + user.uid + '/types')), {
            name: typeName,
            description: typeDescription
        });
        setTypeName("");
        setTypeDescription("");
    };

    const handleKeyDown = (event) => {
        if (event.key == 'Enter') {
            addType(event);
        }
    };

    return (
        <tr>
            <td><input
                placeholder={"Name"}
                value={typeName}
                onChange={field => setTypeName(field.target.value)}
                onKeyDown={handleKeyDown}>
            </input></td>
            <td><input
                placeholder={"Description"}
                value={typeDescription}
                onChange={field => setTypeDescription(field.target.value)}
                onKeyDown={handleKeyDown}>
            </input></td>
            <td><button onClick={addType}>Add</button></td>
        </tr>
    );
};

export default TypesTableFormRow;