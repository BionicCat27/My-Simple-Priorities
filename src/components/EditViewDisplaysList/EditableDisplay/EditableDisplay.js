//React
import React, { useContext } from 'react';
import EditableListDisplay from '../../Displays/ListDisplay/EditableListDisplay';
import ListDisplay from '../../Displays/ListDisplay/ListDisplay';
const EditableDisplay = (props) => {

    const display = props.display;

    switch (display.display) {
        case 'listDisplay':
            return <EditableListDisplay display={display} />;
            break;
        default:
            return <p>Invalid Display</p>;
            break;
    }
};

export default EditableDisplay;