//React
import { update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
const EditableText = (props) => {
    const fieldName = props.fieldName;
    const element = props.element;
    const changeValue = props.changeValue;
    const dbPath = props.dbPath;
    const [value, setValue] = useState(props.value || "");
    const [editValue, setEditingValue] = useState(props.value || "");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setValue(props.value || "");
    }, [props.value]);

    useEffect(() => {
        setIsEditing(false);
        setEditingValue(value);
        changeValue(dbPath, fieldName, value);
    }, [value]);

    const saveEdit = () => {
        setValue(editValue);
        setIsEditing(false);
    };

    const handleKeyDown = (event) => {
        if (event.key == 'Enter') {
            saveEdit();
        }
    };

    if (isEditing || !value) {
        return (
            <>
                <input value={editValue} onKeyDown={handleKeyDown} onChange={field => setEditingValue(field.target.value)}></input>
                <button onClick={() => saveEdit()}>Save</button>
            </>
        );
    }

    return (
        <div className={"clickable"} onClick={() => setIsEditing(true)} >
            {element(value)}
        </div >
    );

};

export default EditableText;