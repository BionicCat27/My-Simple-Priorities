import React, { useContext, useState } from "react";
import { EditableSelect, optionsFromList } from "./EditableSelect";

const CardSizeViewSelector = (props) => {
    const setCardSizeView = props.setCardSizeView;
    const cardSizeView = props.cardSizeView;
    const sizes = optionsFromList([
        'Default',
        'Expanded',
        'List',
    ]);

    return <EditableSelect label={""} value={cardSizeView} setValue={setCardSizeView} options={sizes}  />
}

export default CardSizeViewSelector;