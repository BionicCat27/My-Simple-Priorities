//React
import React, { useContext } from 'react';
import { NavigationContext } from '../../../contexts/NavigationContext';
import { TypesContext } from '../../../contexts/TypesContext';
import IndexTableFormRow from '../../IndexTable/IndexTableFormRow';
const Card = (props) => {

    const { navigateToPage, setParameters } = useContext(NavigationContext);

    const cardTitle = props.cardTitle;
    const typeKey = props.typeKey;
    const dataKey = props.dataKey;

    return (
        <div draggable className={"content_card"} onClick={() => { navigateToPage("#data"); setParameters({ typeKey: typeKey, dataKey: dataKey }); }}>
            {cardTitle}
        </div >
    );
};

export default Card;