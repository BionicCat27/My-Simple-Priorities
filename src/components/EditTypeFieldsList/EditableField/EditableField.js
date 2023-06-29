//React
import React, { useContext } from 'react';
import { ref, remove } from 'firebase/database';
import { DBContext } from '../../../contexts/DBContext';
import EditableTextField from '../../Fields/TextField/EditableTextField';
import EditableDateField from '../../Fields/DateField/EditableDateField';
import EditableNumericField from '../../Fields/NumericField/EditableNumericField';
import EditableIndexField from '../../Fields/IndexField/EditableIndexField';

const EditableField = (props) => {
    const { database } = useContext(DBContext);

    const field = props.field;
    const fieldRef = props.fieldRef;

    function removeDisplay() {
        remove(ref(database, fieldRef));
    }

    function generateDisplay() {
        switch (field.field) {
            case 'textField':
                return <EditableTextField field={field} fieldRef={fieldRef} />;
                break;
            case 'dateField':
                return <EditableDateField field={field} fieldRef={fieldRef} />;
                break;
            case 'numericField':
                return <EditableNumericField field={field} fieldRef={fieldRef} />;
                break;
            case 'indexField':
                return <EditableIndexField field={field} fieldRef={fieldRef} />;
                break;
            default:
                return <p>Invalid Display</p>;
                break;
        }
    }

    return (
        <div className="content_card">
            {generateDisplay()}
            <p className={"clickable remove_button"} onClick={() => removeDisplay()}>Remove</p>
        </div>
    );
};

export default EditableField;