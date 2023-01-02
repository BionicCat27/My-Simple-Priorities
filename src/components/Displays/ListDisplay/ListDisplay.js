//React
import React, { useContext } from 'react';
import { TypeContext } from '../../../contexts/TypeContext';
const ListDisplay = (props) => {

    const { typeData } = useContext(TypeContext);

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
    console.log(`I have type data: ${JSON.stringify(keyedData)}`);
    return (
        <ul>
            {keyedData.map((object) => {
                return <li>{JSON.stringify(object)}</li>;
            })}
        </ul>
    );
};

export default ListDisplay;