import React, { useState } from "react";

const CardStatusViewSelector = (props) => {
    const setCardStatusView = props.setCardSizeView;
    const cardStatusView = props.cardSizeView;
    return (
        <select onChange={field => setCardStatusView(field.target.value)} value={cardStatusView}>
            <option>All</option>
            <option>Planning</option>
            <option>Todo</option>
            <option>In Progress</option>
            <option>Focus</option>
            <option>Done</option>
        </select>
    )
}

export default CardStatusViewSelector;