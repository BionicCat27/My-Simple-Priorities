export const EditableChecklist = (props) => {
    const checklist = props.value;
    const setChecklist = props.setValue;
    const label = props.label;

    function handleCheckBox(value, index) {
        let workingArray = [...checklist];
        workingArray[index].checked = value;
        setChecklist(workingArray);
    }

    function handleCheckBoxValue(value, index) {
        let workingArray = [...checklist];
        workingArray[index].value = value;
        setChecklist(workingArray);
    }

    function addChecklistItem() {
        let workingArray = [...checklist];
        workingArray.push({
            checked: false,
            value: ""
        });
        setChecklist(workingArray);
    }

    return (
        <>
            {label && <label>{label}</label>}
            {
                checklist && checklist.map((checklistObject, index) => (
                    <div key={`${index}Container`}>
                        <input className="inline-input" type="checkbox" checked={checklistObject.checked} onChange={field => handleCheckBox(field.target.checked, index)} />
                        <input className="inline-input" type="text" value={checklistObject.value} onChange={field => handleCheckBoxValue(field.target.value, index)} />
                    </div>
                ))
            }
            <div id="formButtonContainer">
                <button onClick={() => { addChecklistItem(); }}>Add item</button>
            </div>
        </>
    );
};