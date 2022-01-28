import React, { useState } from "react";

const PriorityCard = (props) => {
    const [showButtons, setShowButtons] = useState(false);

    function toggleShow() {
        setShowButtons(!showButtons);
    }

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

    let buttonBlockClassList = "button-block ";
    if (!showButtons) {
        buttonBlockClassList += "display-none ";
    }

    return (
        <div className="div-card" onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
            <h3>{props.title}</h3>
            <div className={buttonBlockClassList}>
                <button id="moveup_priority" className="priority-button" onClick={movePriorityUp}>Move Up</button>
                <button id="movedown_priority" className="priority-button" onClick={movePriorityDown}>Move Down</button>
                <button id="delete_priority" className="priority-button" onClick={deletePriority}>Delete Priority</button>
            </div>
        </div>
    );
};

export default PriorityCard;