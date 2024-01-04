import { useContext, useEffect, useState } from "react";
import { DBContext } from "../../contexts/DBContext";

/**
 * 
 * @param label - input label text
 * @param value (Controlled) - current selected option
 * @param setValue (Controlled) - function that updates the selected option
 * @param path (Self-controlled) - data path for self controlled input
 * @param dataname (Self-controlled) - data type name for path
 * @param options (Self-controlled) - options for select
 * @param defaultOption (Optional) - default option
 */
export const EditableSelect = (props) => {
    const { addDataListener, ready, updateObject, asKeyedList } = useContext(DBContext);

    const label = props.label;
    const options = props.options;
    const defaultOption = props.defaultOption;
    const path = props.path;
    const dataname = props.dataname;

    if (!path) {
        const value = props.value;
        const setValue = props.setValue;
        return (
            <>
                {label && <label>{label}</label>}
                <select value={value} onChange={(field) => { setValue(field.target.value); }}>
                    {defaultOption && <option>{defaultOption}</option>}
                    {options &&
                        options.map(option => {
                            return <option value={option.key} key={`${label}Option/${option.key}`}>{option.name}</option>;
                        })
                    }
                </select>
            </>
        );
    } else {
        const [initialValue, setInitialValue] = useState("");
        const [value, setValue] = useState("");

        function handleSetValue(input) {
            setInitialValue(input || "");
            setValue(input || "");
        }

        useEffect(() => {
            if (ready) {
                addDataListener(`${path}/${dataname}`, handleSetValue, false);
            }
        }, []);

        return (
            <>
                {label && <label>{label}</label>}
                <select value={value} onChange={(field) => { setValue(field.target.value); }}>
                    {defaultOption && <option>{defaultOption}</option>}
                    {options && options.map(option => {
                        return <option value={option.key} key={`${label}Option/${option.key}`}>{option.name}</option>;
                    }
                    )
                    }
                </select>
                <button onClick={() => { updateObject(`${path}`, dataname, value); }} disabled={value === initialValue}>Save {label}</button>
            </>
        );
    }
};

export function optionsFromList(list) {
    return list.map(item => {
        return {
            'key': item,
            'name': item
        };
    });
}