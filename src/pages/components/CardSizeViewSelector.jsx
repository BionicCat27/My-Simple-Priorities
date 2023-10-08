import React, { useState } from "react";

const CardSizeViewSelector = (props) => {
    const setCardSizeView = props.setCardSizeView;
    const cardSizeView = props.cardSizeView;
    return (
        <select onChange={field => setCardSizeView(field.target.value)} value={cardSizeView}>
            <option>Default</option>
            <option>Expanded</option>
            <option>List</option>
        </select>
    )
}

export default CardSizeViewSelector;