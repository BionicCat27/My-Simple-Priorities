export const EditableSelect = (props) => {
    const label = props.label;
    const options = props.options;
    const defaultOption = props.defaultOption;

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
};

export function optionsFromList(list){
    return list.map(item => {
        return {
            'key': item,
            'name': item
        }
    });
}