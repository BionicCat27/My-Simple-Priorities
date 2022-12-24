//React
import { ref, remove } from 'firebase/database';
import React, { useContext } from 'react';
import { DBContext } from '../../../contexts/DBContext';
import EditableListDisplay from '../../Displays/ListDisplay/EditableListDisplay';
const EditableDisplay = (props) => {

    const { database } = useContext(DBContext);

    const display = props.display;
    const displayRef = props.displayRef;

    function removeDisplay() {
        remove(ref(database, displayRef));
    }

    switch (display.display) {
        case 'listDisplay':
            return <>
                <EditableListDisplay display={display} displayRef={displayRef} />
                <p className={"clickable"} onClick={() => removeDisplay()}>Remove</p>
            </>;
            break;
        default:
            return <>
                <p>Invalid Display</p>
                <p className={"clickable"} onClick={() => removeDisplay()}>Remove</p>
            </>;
            break;
    }
};

export default EditableDisplay;