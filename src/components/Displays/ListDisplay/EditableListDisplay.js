//React
import React from 'react';
const EditableListDisplay = (props) => {

    const display = props.display;

    if (!display) {
        return null;
    }
    return (
        <div>
            <p>Select Type</p>
            <select>
                <option></option>
            </select>
        </div>
    );
};

export default EditableListDisplay;