//React
import { off, onValue, ref, update } from 'firebase/database';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { DBContext } from '../../../contexts/DBContext';
import EditableText from '../../EditableText/EditableText';
import { TypesContext } from '../../../contexts/TypesContext';
const EditableCardsDisplay = (props) => {

    const { user } = useContext(AuthContext);
    const { database } = useContext(DBContext);
    const { getType } = useContext(TypesContext);

    const [typesDbRef, setTypesDbRef] = useState(undefined);
    const [displayDbRef, setDisplayDbRef] = useState(undefined);
    const [types, setTypes] = useState([]);

    const display = props.display;
    const displayRef = props.displayRef;

    let displayType = display?.type || undefined;
    let displayOrderBy = display?.orderBy || undefined;

    let typeData = getType(displayType);
    let typeFields = [];
    if (typeData?.fields) {
        typeFields = Object.keys(typeData.fields).map((key) => {
            let value = typeData.fields[key];
            value.key = key;
            return value;
        });
    }


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

    function setDisplayValue(dataPath, fieldName, value) {
        if (displayDbRef) {
            let updates = {};
            updates[fieldName] = value;

            let res = update(displayDbRef, updates);
        }
    };

    if (!display) {
        return null;
    }

    return (
        <div>
            <h3>Card Display</h3>
            <label>Title</label>
            <EditableText value={display.title} fieldName="title" element={(content) => <h3>{content}</h3>} changeValue={setDisplayValue} dbPath={""} />
            <label>Type</label>
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
            {
                typeData ? <>
                    <label>Order By</label>
                    <select value={displayOrderBy ? displayOrderBy : "Order By"} onChange={field => { setDisplayType(field.target.value); }}>
                        {(display && display.orderBy)
                            ? null
                            : <option defaultValue hidden disabled>Select Order By Field</option>
                        }
                        {typeFields.map((field) => {
                            return (
                                <option key={field.key} value={field.key} >{field.title}</option>
                            );
                        })}
                    </select>
                </> : null
            }

        </div>
    );
};

export default EditableCardsDisplay;