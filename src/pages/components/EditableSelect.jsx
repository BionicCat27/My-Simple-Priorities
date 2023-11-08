import { useContext, useEffect, useState } from "react";
import { DBContext } from "../../contexts/DBContext";

export const EditableSelect = (props) => {
    const {addDataListener, ready, updateObject, asKeyedList} = useContext(DBContext);

    const label = props.label;
    const options = props.options;
    const defaultOption = props.defaultOption;
    const path = props.path;
    const dataname = props.dataname;

    if(!path) {
        const value = props.value;
        const setValue = props.setValue;
        return (
            <>
                {label && <label>{label}</label>}
                <select value={value} onChange={(field) => { setValue(field.target.value); }}>
                    {defaultOption && <option>{defaultOption}</option>}
                    {options && options.map(option => {
                                return <option value={option.key} key={`${label}Option/${option.key}`}>{option.name}</option>
                            }
                        )
                    }
                </select>
            </>
        );
    }

    const [initialValue, setInitialValue] = useState("");
    const [value, setValue] = useState("");

    function handleSetValue(input) {
        setInitialValue(input || "");
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
            <select value={value} onChange={(field) => { setValue(field.target.value); }}>
                {defaultOption && <option>{defaultOption}</option>}
                {options && options.map(option => {
                            return <option value={option.key} key={`${label}Option/${option.key}`}>{option.name}</option>
                        }
                    )
                }
            </select>
            <button onClick={()=>{updateObject(`${path}`, dataname, value)}} disabled={value === initialValue}>Save {label}</button>
        </>
    )
};

export function optionsFromList(list){
    return list.map(item => {
        return {
            'key': item,
            'name': item
        }
    });
}