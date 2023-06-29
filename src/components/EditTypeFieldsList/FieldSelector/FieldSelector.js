//React
import React, { useContext, useEffect, useState } from 'react';
const FieldSelector = (props) => {

    const addField = props.addField;
    const hasIndex = props.hasIndex;

    const [selectorValue, setSelectorValue] = useState("textField");

    return (
        <div>
            <select value={selectorValue} onChange={change => setSelectorValue(change.target.value)}>
                <option value={"textField"}>Text</option>
                <option value={"dateField"}>Date</option>
                <option value={"numericField"}>Numeric</option>
                {!hasIndex ? <option value={"indexField"}>Index</option> : null}
            </select>
            <button onClick={() => { if (selectorValue != "") addField(selectorValue); }}>Add Field</button>
        </div>
    );
};

export default FieldSelector;