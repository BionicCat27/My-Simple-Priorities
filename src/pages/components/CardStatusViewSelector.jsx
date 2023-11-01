import React, { useContext, useState } from "react";
import { EditableSelect, optionsFromList } from "./EditableSelect";

const CardStatusViewSelector = (props) => {
    const setCardStatusView = props.setCardSizeView;
    const cardStatusView = props.cardSizeView;
    const statuses = optionsFromList([
        'All',
        'Planning',
        'Todo',
        'In Progress',
        'Focus',
        'Done',
    ]);
    return <EditableSelect label={""} value={cardStatusView} setValue={setCardStatusView} options={statuses}  />;
}

export default CardStatusViewSelector;