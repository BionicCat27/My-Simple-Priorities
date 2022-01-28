import React, { useState } from "react";

const PriorityCard = (props) => {
    const [showButtons, setShowButtons] = useState(false);

    function cardClicked() {
        setShowButtons(!showButtons);
    }

    return (
        <div className="div-card" onClick={cardClicked}>
            <h3>{props.title}</h3>
            <div className={"button-block " + (showButtons || "display-none")}>
                <button id="moveup_priority" className="priority-button">Move Up</button>
                <button id="movedown_priority" className="priority-button">Move Down</button>
                <button id="delete_priority" className="priority-button">Delete Priority</button>
            </div>
        </div>
    );
};

export default PriorityCard;