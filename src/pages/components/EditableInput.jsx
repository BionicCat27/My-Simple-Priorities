import { useContext, useEffect, useState } from "react";
import { DBContext } from "../../contexts/DBContext";

export const EditableInput = (props) => {
    const {addDataListener, ready, updateObject, asKeyedList} = useContext(DBContext);

    const label = props.label;
    const type = props.type;
    const path = props.path;
    const dataname = props.dataname;

    if(!path) {
        const value = props.value;
        const setValue = props.setValue;
        return (
            <>
                {label && <label>{label}</label>}
                <input value={value} onChange={(field) => { setValue(field.target.value); }} type={type} />
            </>
        );
    }

    const [value, setValue] = useState("");

    function handleSetValue(input) {
        setValue(input || "")
    }
    
    useEffect(()=> {
        if(ready) {
            addDataListener(`${path}/${dataname}`, handleSetValue, false);
        }
    }, [])

    return (
        <>
            {label && <label>{label}</label>}
            <input value={value} onChange={(field) => { setValue(field.target.value); }} type={type} />
            <button onClick={()=>{updateObject(`${path}`, dataname, value)}}>Save {label}</button>
        </>
    )

};