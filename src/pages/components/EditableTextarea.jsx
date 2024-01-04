/**
 * 
 * @param label - input label text
 * @param value (Controlled) - value of input
 * @param setValue (Controlled) - function that updates the value of the input
 */
export const EditableTextarea = (props) => {
    const label = props.label;
    const value = props.value;
    const setValue = props.setValue;
    const disabled = props.disabled;

    return (
        <>
            {label && <label className="displayBlock">{label}</label>}
            <textarea value={value} onChange={(field) => { setValue(field.target.value); }} disabled={disabled} />
        </>
    );
};