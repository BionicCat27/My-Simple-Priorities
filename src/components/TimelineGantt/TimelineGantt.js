//React
import React, { useEffect, useState } from "react";

const TimelineGantt = (props) => {

    const cards = props.cards;

    return (
        <div>
            {cards.map(card => {
                return (<p key={`${card.index}${card.title}`}>{card.title}</p>)
            })}
        </div>
    );
};

export default TimelineGantt;