//React
import { off, onValue, ref, update } from 'firebase/database';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { DBContext } from '../../../contexts/DBContext';
const EditableListDisplay = (props) => {

    const { user } = useContext(AuthContext);
    const { database } = useContext(DBContext);

    const [typesDbRef, setTypesDbRef] = useState(undefined);
    const [displayDbRef, setDisplayDbRef] = useState(undefined);
    const [types, setTypes] = useState([]);

    const display = props.display;
    const displayRef = props.displayRef;

    let displayType = display?.type || undefined;

    //Set db ref on user set
    useEffect(() => {
        if (user) {
            if (typesDbRef) {
                off(typesDbRef);
            }
            if (displayDbRef) {
                off(displayDbRef);
            }
            setTypesDbRef(ref(database, `users/${user.uid}/types`));
            if (display) {
                setDisplayDbRef(ref(database, `${displayRef}`));
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

    function setDisplayType(value) {
        if (displayDbRef) {
            let updates = {};
            updates["type"] = value;
            let res = update(displayDbRef, updates);
        }
    }

    if (!display) {
        return null;
    }
    return (
        <div>
            <h3>List Display</h3>
            <h4>Type</h4>
            <select value={displayType ? displayType : "Select Type"} onChange={field => { setDisplayType(field.target.value); }}>
                {(display && display.type)
                    ? null
                    : <option defaultValue hidden disabled>Select Type</option>
                }
                {types.map((type) => {
                    if (type.key == displayType) {
                        return <option key={type.key} value={type.key} defaultValue>{type.name}</option>;
                    }
                    return (
                        <option key={type.key} value={type.key}>{type.name}</option>
                    );
                })}
            </select>
        </div>
    );
};

export default EditableListDisplay;