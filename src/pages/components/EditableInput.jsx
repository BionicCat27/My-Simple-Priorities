import { useContext, useEffect, useState } from "react";
import { DBContext } from "../../contexts/DBContext";
import '../common.css';

/**
 * 
 * @param label - input label text
 * @param value (Controlled) - value of input
 * @param setValue (Controlled) - function that updates the value of the input
 * @param path (Self-controlled) - data path for self controlled input
 * @param dataname (Self-controlled) - data type name for path
 * @param type (Optional) - input type
 * @param size (Optional) - size of the input text
 * @param disabled (Optional) - input should be disabled
 */

export const InputSizes = {
    "h1": 1,
    "h2": 2,
    "h3": 3,
    "h4": 4,
    "h5": 5,
    "h6": 6,
    "p": 7,
};

export const EditableInput = (props) => {
    const { addDataListener, ready, updateObject, asKeyedList } = useContext(DBContext);

    const label = props.label;
    const placeholder = props.placeholder;
    const type = props.type;
    const path = props.path;
    const dataname = props.dataname;
    const size = props.size;
	const disabled = props.disabled;
    let onSubmit = props.onSubmit;

    function handleSubmit(event) {
        if (event.key === 'Enter' && onSubmit) {
            onSubmit();
        }
    }

    if (!path) {
        const value = props.value;
        const setValue = props.setValue;
        return (
            <>
                {label && <label>{label}</label>}
                <input disabled={disabled} size={value.length} placeholder={placeholder || ""} className={`input-${size}`} value={value} onChange={(field) => { setValue(field.target.value); }} onKeyDown={handleSubmit} type={type} />
            </>
        );
    }

    const [initialValue, setInitialValue] = useState("");
    const [value, setValue] = useState("");

    function handleSetValue(input) {
        setInitialValue(input || "");
        setValue(input || "");
    }

    if (!onSubmit) {
        onSubmit = () => {
            updateObject(path, dataname, value);
        };
    }

    useEffect(() => {
        if (ready) {
            addDataListener(`${path}/${dataname}`, handleSetValue, false);
        }
    }, []);

    return (
        <>
            {label && <label>{label}</label>}
            <input disabled={disabled} className={`display-inline-block input-${size}`} placeholder={placeholder || ""} size={value.length} value={value} onChange={(field) => { setValue(field.target.value); }} onKeyDown={handleSubmit} type={type} />
            <button className={`display-inline-block margin-x-002`} onClick={onSubmit} disabled={value === initialValue}>Save {label}</button>
        </>
    );

};
