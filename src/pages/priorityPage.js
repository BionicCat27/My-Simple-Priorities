import React, { useState } from 'react';

//Components
import PageTitle from '../components/PageTitle';
import Priorities from '../components/Priorities';

const PriorityPage = () => {
    const [priorityList, setPriorityList] = useState([]);
    const [priorityInput, setPriorityInput] = useState("");

    function addPriority() {
        if (priorityInput.length == 0) {
            return;
        }
        let concatList = [priorityInput].concat(priorityList);
        setPriorityList(concatList);
        setPriorityInput("");
    }

    function onPriorityInputChange(value) {
        setPriorityInput(value);
    }

    function movePriority(fromIndex, toIndex) {
        console.log("moving priority");
        if (fromIndex < 0 || toIndex < 0 || fromIndex > priorityList.length || toIndex > priorityList.length) {
            console.log("An error occurred (" + fromIndex + " " + toIndex + " " + priorityList + ")");
            return;
        }
        let workingList = priorityList.slice();
        var element = workingList[fromIndex];
        workingList.splice(fromIndex, 1);
        workingList.splice(toIndex, 0, element);
        setPriorityList(workingList);
    }

    function deletePriority(index) {
        if (index < 0 || index > priorityList.length) {
            console.log("An error occurred (" + index + " " + priorityList + ")");
            return;
        }
        let workingList = priorityList.slice();
        workingList.splice(index, 1);
        setPriorityList(workingList);
    }

    function updatePriority(index, value) {
        let workingList = priorityList.slice();
        workingList[index] = value;
        setPriorityList(workingList);
    }

    return (
        <div className="main-content">
            <PageTitle title="My Simple Priorities" />
            <div id="PriorityContent" className="div-card">
                <p>My Priorities</p>
                <input value={priorityInput} onChange={field => onPriorityInputChange(field.target.value)} type="text" id="priority_field" />
                <button id="PriorityButton" onClick={() => addPriority()}>Add priority!</button>
                <Priorities priorityList={priorityList} key={priorityList} movePriority={movePriority} deletePriority={deletePriority} updatePriority={updatePriority} />
            </div>
        </div >
    );
};

export default PriorityPage;