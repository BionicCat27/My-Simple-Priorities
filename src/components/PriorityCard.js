import React, { useState } from "react";

const PriorityCard = (props) => {
    const [showButtons, setShowButtons] = useState(false);
    const [editingPriority, setEditingPriority] = useState(false);
    const [priorityValue, setPriorityValue] = useState(props.title);
    const [priorityInputValue, setPriorityInputValue] = useState(props.title);

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
        props.updatePriority(props.priorityIndex, priorityValue);
    }

    let buttonBlockClassList = "button-block ";
    if (!showButtons) {
        buttonBlockClassList += "display-none ";
    }

    return (
        <div className="div-card" onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
            {editingPriority ? <input className="margin-y-1" onChange={field => updatePriorityInput(field.target.value)} value={priorityInputValue}></input> : <h3 onClick={() => setEditingPriority(true)}>{priorityValue}</h3>}
            <div className={buttonBlockClassList}>
                {
                    editingPriority ? <button id="edit_priority" className="priority-button" onClick={updatePriority}>Done</button>
                        : <button id="edit_priority" className="priority-button" onClick={() => setEditingPriority(true)}>Edit</button>
                }
                <button id="moveup_priority" className="priority-button" onClick={movePriorityUp}>Move Up</button>
                <button id="movedown_priority" className="priority-button" onClick={movePriorityDown}>Move Down</button>
                <button id="delete_priority" className="priority-button" onClick={deletePriority}>Delete Priority</button>
            </div>
        </div >
    );
};

export default PriorityCard;