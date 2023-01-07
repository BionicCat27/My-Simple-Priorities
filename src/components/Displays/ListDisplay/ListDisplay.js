//React
import React, { useContext } from 'react';
import { NavigationContext } from '../../../contexts/NavigationContext';
import { TypeContext } from '../../../contexts/TypeContext';
const ListDisplay = (props) => {

    const { typeData } = useContext(TypeContext);

    const { navigateToPage } = useContext(NavigationContext);

    const display = props.display;
    if (!typeData || !typeData.name) {
        return (
            <p>No type found.</p>
        );
    }
    if (!typeData.data) {
        return (
            <p>No type data for {typeData.name}.</p>
        );
    }
    function keyData(data) {
        if (!data) {
            return [];
        }
        let keyedData = Object.keys(data).map((key) => {
            let value = data[key];
            value.key = key;
            return value;
        });
        return keyedData;
    }
    let keyedData = keyData(typeData.data);
    return (
        <>
            <h2>List of {typeData.name}</h2>
            <ul>
                {keyedData.map((object) => {
                    return <li className={"clickable"} key={JSON.stringify(object)} onClick={() => navigateToPage("#data")}><h3>{object.name}</h3></li>;
                })}
            </ul>
        </>
    );
};

export default ListDisplay;