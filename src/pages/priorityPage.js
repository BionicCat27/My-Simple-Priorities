import React, { useState } from 'react';

//Components
import PageTitle from '../components/PageTitle';
import Priorities from '../components/Priorities';

const PriorityPage = () => {
    const [priorityList, setPriorityList] = useState([]);
    const [priorityInput, setPriorityInput] = useState("");

    function addPriority() {
        let concatList = priorityList.concat([priorityInput]);
        setPriorityList(concatList);
        setPriorityInput("");
        console.log("Priorities: " + priorityList);
    }

    function onPriorityInputChange(value) {
        setPriorityInput(value);
    }

    return (
        <div className="main-content">
            <PageTitle title="My Simple Priorities" />
            <div id="PriorityContent" className="div-card">
                <p>My Priorities</p>
                <input value={priorityInput} onChange={field => onPriorityInputChange(field.target.value)} type="text" id="priority_field" />
                <button id="PriorityButton" onClick={() => addPriority()}>Add priority!</button>
                <Priorities priorityList={priorityList} />
            </div>
        </div >
    );
};

export default PriorityPage;