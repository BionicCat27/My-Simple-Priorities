import React, { useEffect, useState } from "react";

import './PriorityCard.css';

const PriorityCard = (props) => {
    const [showButtons, setShowButtons] = useState(false);
    const [editingPriority, setEditingPriority] = useState(false);
    const [priorityTitleValue, setPriorityTitleValue] = useState(props.title);
    const [priorityDescriptionValue, setPriorityDescriptionValue] = useState(props.description);
    const [priorityTitleInputValue, setPriorityTitleInputValue] = useState(props.title);
    const [priorityDescriptionInputValue, setPriorityDescriptionInputValue] = useState(props.description);

    useEffect(() => {
        let priorityTitleOutput = priorityTitleValue;
        if (!priorityTitleOutput) {
            priorityTitleOutput = "";
        }
        let priorityDescriptionOutput = priorityDescriptionValue;
        if (!priorityDescriptionOutput) {
            priorityDescriptionOutput = "";
        }
        let output = {
            title: priorityTitleOutput,
            description: priorityDescriptionOutput
        };
        props.updatePriority(props.priorityIndex, output);
    }, [priorityTitleValue, priorityDescriptionValue]);

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

    function updatePriorityTitleInput(value) {
        setPriorityTitleInputValue(value);
    }

    function updatePriorityDescriptionInput(value) {
        setPriorityDescriptionInputValue(value);
    }

    function updatePriority() {
        setPriorityTitleValue(priorityTitleInputValue);
        setPriorityDescriptionValue(priorityDescriptionInputValue);
        setEditingPriority(false);
    }

    if (editingPriority) {
        return (<div id="priorityCard" onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
            <div id="priorityContainer">
                <label htmlFor="prioriotyTitleInputValue">Title</label>
                <input id="priorityTitleInputValue" className="margin-y-1" onChange={field => updatePriorityTitleInput(field.target.value)} value={priorityTitleInputValue}></input>
                <label htmlFor="priorityDescriptionInputValue">Description</label>
                <textarea id="priorityDescriptionInputValue" className="margin-y-1" onChange={field => updatePriorityDescriptionInput(field.target.value)} value={priorityDescriptionInputValue}></textarea>
            </div>
            {showButtons &&
                <div id="priorityButtonContainer" className="button-block">
                    <button id="edit_priority" className="priority-button" onClick={updatePriority}>Done</button>
                </div>
            }
        </div >);
    }
    return (
        <div id="priorityCard" onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
            <div id="priorityContainer">
                <h3 onClick={() => setEditingPriority(true)}>{priorityTitleValue}</h3>
                {priorityDescriptionValue && <p>{priorityDescriptionValue}</p>}
            </div>
            {showButtons &&
                <div id="priorityButtonContainer" className="button-block">
                    <div>
                        <button id="edit_priority" className="priority-button" onClick={() => setEditingPriority(true)}>Edit</button>
                        <button id="moveup_priority" className="priority-button" onClick={movePriorityUp}>Up</button>
                        <button id="movedown_priority" className="priority-button" onClick={movePriorityDown}>Down</button>
                        <button id="delete_priority" className="priority-button" onClick={deletePriority}>Delete</button>
                    </div>
                </div>
            }
        </div >
    );
};

export default PriorityCard;