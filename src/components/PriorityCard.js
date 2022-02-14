import React, { useEffect, useState } from "react";

import './PriorityCard.css';

const PriorityCard = (props) => {
    const [showButtons, setShowButtons] = useState(false);
    const [editingPriority, setEditingPriority] = useState(false);
    const [priorityValue, setPriorityValue] = useState(props.title);
    const [priorityInputValue, setPriorityInputValue] = useState(props.title);

    useEffect(() => {
        let priorityTitleOutput = priorityValue;
        if (!priorityTitleOutput) {
            priorityTitleOutput = "";
        }
        let output = {
            title: priorityValue,
            description: ""
        };
        props.updatePriority(props.priorityIndex, output);
    }, [priorityValue]);

    function movePriorityUp() {
        let currentIndex = props.priorityIndex;
        props.movePriority(currentIndex, currentIndex - 1);
    }

    function movePriorityDown() {
        let currentIndex = props.priorityIndex;
        props.movePriority(currentIndex, currentIndex + 1);
    }

    function deletePriority() {
        props.deletePriority(props.priorityIndex);
    }

    function updatePriorityInput(value) {
        setPriorityInputValue(value);
    }

    function updatePriority() {
        setPriorityValue(priorityInputValue);
        setEditingPriority(false);
    }

    return (
        <div id="priorityCard" onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
            <div id="priorityContainer">
                {editingPriority
                    ? <input className="margin-y-1" onChange={field => updatePriorityInput(field.target.value)} value={priorityInputValue}></input>
                    : <h3 onClick={() => setEditingPriority(true)}>{priorityValue}</h3>}
            </div>
            {showButtons &&
                <div id="priorityButtonContainer" className="button-block">
                    {editingPriority
                        ? <button id="edit_priority" className="priority-button" onClick={updatePriority}>Done</button>
                        : <div>
                            <button id="edit_priority" className="priority-button" onClick={() => setEditingPriority(true)}>Edit</button>
                            <button id="moveup_priority" className="priority-button" onClick={movePriorityUp}>Up</button>
                            <button id="movedown_priority" className="priority-button" onClick={movePriorityDown}>Down</button>
                            <button id="delete_priority" className="priority-button" onClick={deletePriority}>Delete</button>
                        </div>
                    }
                </div>
            }
        </div >
    );
};

export default PriorityCard;