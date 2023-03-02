//React
import React, { useContext, useEffect, useState } from 'react';
const DisplaySelector = (props) => {

    const addDisplay = props.addDisplay;

    const [selectorValue, setSelectorValue] = useState("listDisplay");

    return (
        <div>
            <select value={selectorValue} onChange={change => setSelectorValue(change.target.value)}>
                <option value={"listDisplay"}>List</option>
                <option value={"cardsDisplay"}>Cards</option>
            </select>
            <button onClick={() => { if (selectorValue != "") addDisplay(selectorValue); }}>Add Display</button>
        </div>
    );
};

export default DisplaySelector;