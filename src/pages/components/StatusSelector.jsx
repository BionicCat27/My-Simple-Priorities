import React, { useState } from "react";

const StatusSelector = (props) => {
    const status = props.value;
    const setStatus = props.setValue;
    let todoSelected = (status == "Todo" ? "btn-active" : "");
    let inprogSelected = (status == "In Progress" ? "btn-active" : "");
    let doneSelected = (status == "Done" ? "btn-active" : "");
    return (
        <div id="formButtonContainer">
            <button onClick={() => { setStatus("Todo"); }} className={todoSelected}>Todo</button>
            <button onClick={() => { setStatus("In Progress"); }} className={inprogSelected}>In Progress</button>
            <button onClick={() => { setStatus("Done"); }} className={doneSelected}>Done</button>
        </div>
    );
};

export default StatusSelector;