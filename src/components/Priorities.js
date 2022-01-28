import React, { useState } from "react";
import PriorityCard from "./PriorityCard";

function Priorities(props) {
    return (
        < div key={props.priorityIndex} >
            {
                props.priorityList.map((priorityTitle, index) => <PriorityCard title={priorityTitle} key={index} priorityIndex={index} movePriority={props.movePriority} deletePriority={props.deletePriority} />)
            }
        </div>
    );
};

export default Priorities;