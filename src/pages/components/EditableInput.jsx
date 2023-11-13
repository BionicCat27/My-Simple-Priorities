import { useContext, useEffect, useState } from "react";
import { DBContext } from "../../contexts/DBContext";

export const EditableInput = (props) => {
    const {addDataListener, ready, updateObject, asKeyedList} = useContext(DBContext);

    const label = props.label;
    const type = props.type;
    const path = props.path;
    const dataname = props.dataname;
    let onSubmit = props.onSubmit;

    function handleSubmit(event) {
        if(event.key === 'Enter' && onSubmit) {
            onSubmit();
        }
    }

    if(!path) {
        const value = props.value;
        const setValue = props.setValue;
        return (
            <>
                {label && <label>{label}</label>}
                <input value={value} onChange={(field) => { setValue(field.target.value); }} onKeyDown={handleSubmit} type={type} />
            </>
        );
    }

    const [initialValue, setInitialValue] = useState("");
    const [value, setValue] = useState("");

    function handleSetValue(input) {
        setInitialValue(input || "");
        setValue(input || "")
    }

    onSubmit = () => {
        updateObject(path, dataname, value);
    }
    
    useEffect(()=> {
        if(ready) {
            addDataListener(`${path}/${dataname}`, handleSetValue, false);
        }
    }, [])

    return (
        <>
            {label && <label>{label}</label>}
            <input className="display-inline-block" value={value} onChange={(field) => { setValue(field.target.value); }} onKeyDown={handleSubmit} type={type} />
            <button className="display-inline-block margin-x-002" onClick={onSubmit} disabled={value === initialValue}>Save {label}</button>
        </>
    )

};