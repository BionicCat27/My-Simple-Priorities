import React from "react";
import PriorityCard from "./PriorityCard";

const Priorities = (props) => {
    return (
        < div >
            {
                props.priorityList.map((priorityTitle, index) => <PriorityCard title={priorityTitle} key={index} />)
            }
        </div>
    );
};

export default Priorities;