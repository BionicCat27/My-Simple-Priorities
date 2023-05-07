//React
import { off, onValue, ref, update } from 'firebase/database';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { DBContext } from '../../../contexts/DBContext';
import EditableText from '../../EditableText/EditableText';
const EditableNumericField = (props) => {

    const { user } = useContext(AuthContext);
    const { database } = useContext(DBContext);

    const [typesDbRef, setTypesDbRef] = useState(undefined);
    const [fieldDbRef, setFieldDbRef] = useState(undefined);
    const [types, setTypes] = useState([]);

    const field = props.field;
    const fieldRef = props.fieldRef;

    let fieldType = field?.type || undefined;

    //Set db ref on user set
    useEffect(() => {
        if (user) {
            if (typesDbRef) {
                off(typesDbRef);
            }
            if (fieldDbRef) {
                off(fieldDbRef);
            }
            setTypesDbRef(ref(database, `users/${user.uid}/types`));
            if (field) {
                setFieldDbRef(ref(database, `${fieldRef}`));
            }
            setTypes([]);
        }
    }, [user]);

    useEffect(() => {
        if (!typesDbRef) {
            return;
        }
        if (!user) {
            console.log("Can't load content - no user found.");
            return;
        }
        onValue(typesDbRef, (snapshot) => {
            const data = snapshot.val();
            if (data == null) {
                console.log("An error occurred.");
                setTypes([]);
                return;
            }
            let keyedData = Object.keys(data).map((key) => {
                let value = data[key];
                value.key = key;
                return value;
            });
            setTypes(keyedData);
        });
    }, [typesDbRef]);

    function setFieldValue(dataPath, fieldName, value) {
        if (fieldDbRef) {
            let updates = {};
            updates[fieldName] = value;

            let res = update(fieldDbRef, updates);
        }
    }

    if (!field) {
        return null;
    }
    return (
        <div>
            <h3>Numeric Field</h3>
            <h4>Name</h4>
            <EditableText value={field.title} fieldName="title" element={(content) => <h3>{content}</h3>} changeValue={setFieldValue} dbPath={""} />
        </div>
    );
};

export default EditableNumericField;