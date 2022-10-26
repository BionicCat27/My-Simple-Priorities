//React
import { push, ref, set, update } from 'firebase/database';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { DBContext } from '../../../contexts/DBContext';
//Components
const ViewsTableFormRow = (props) => {
    const authContext = useContext(AuthContext);
    const { database } = useContext(DBContext);
    const user = authContext.user;

    const [viewName, setViewName] = useState("");
    const [viewDescription, setViewDescription] = useState("");

    function addType(event) {
        event.preventDefault();
        set(push(ref(database, 'users/' + user.uid + '/views')), {
            name: viewName,
            description: viewDescription
        });
        setViewName("");
        setViewDescription("");
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
                value={viewName}
                onChange={field => setViewName(field.target.value)}
                onKeyDown={handleKeyDown}>
            </input></td>
            <td><input
                placeholder={"Description"}
                value={viewDescription}
                onChange={field => setViewDescription(field.target.value)}
                onKeyDown={handleKeyDown}>
            </input></td>
            <td><button onClick={addType}>Add</button></td>
        </tr>
    );
};

export default ViewsTableFormRow;