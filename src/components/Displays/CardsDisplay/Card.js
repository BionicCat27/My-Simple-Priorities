//React
import React, { useContext } from 'react';
import { NavigationContext } from '../../../contexts/NavigationContext';
import './Card.css';
const Card = (props) => {

    const { navigateToPage } = useContext(NavigationContext);

    const cardTitle = props.cardTitle;
    const typeKey = props.typeKey;
    const dataKey = props.dataKey;

    return (
        <div draggable className={"content_card clickable"} onClick={() => { navigateToPage("/data", { typeKey: typeKey, dataKey: dataKey }); }}>
            {cardTitle}
        </div >
    );
};

export default Card;