//React
import React, { useContext } from 'react';
import { NavigationContext } from '../../../contexts/NavigationContext';
import './Card.css';
import { useNavigate } from 'react-router';
const Card = (props) => {
    const navigate = useNavigate();

    const { setParameters } = useContext(NavigationContext);

    const cardTitle = props.cardTitle;
    const typeKey = props.typeKey;
    const dataKey = props.dataKey;

    return (
        <div draggable className={"content_card clickable"} onClick={() => { navigate("/data"); setParameters({ typeKey: typeKey, dataKey: dataKey }); }}>
            {cardTitle}
        </div >
    );
};

export default Card;