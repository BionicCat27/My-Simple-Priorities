export const EditableInput = (props) => {
    const label = props.label;
    const value = props.value;
    const setValue = props.setValue;
    const type = props.type;

    return (
        <>
            {label && <label>{label}</label>}
            <input value={value} onChange={(field) => { setValue(field.target.value); }} type={type} />
        </>
    );
};