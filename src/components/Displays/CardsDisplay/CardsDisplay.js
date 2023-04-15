//React
import React, { useContext } from 'react';
import { NavigationContext } from '../../../contexts/NavigationContext';
import { TypesContext } from '../../../contexts/TypesContext';
import IndexTableFormRow from '../../IndexTable/IndexTableFormRow';
import Card from './Card';
const CardsDisplay = (props) => {

    const { getType } = useContext(TypesContext);

    const { navigateToPage, setParameters } = useContext(NavigationContext);

    const display = props.display;
    let typeKey = display.type;
    let typeData = getType(typeKey);

    if (!typeData || !typeData.name) {
        return (
            <p>No type found.</p>
        );
    }

    let datatype = { name: "Data", field: `types/${typeKey}/data`, target: "data" };
    let fields = [{ name: "Name", field: "name" }, { name: "Description", field: "description" }];

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
            <h2>{display.title}</h2>
            <table><thead><IndexTableFormRow datatype={datatype} fields={fields} /></thead></table>
            {keyedData.map((object) => {
                return <Card className={"clickable"} key={JSON.stringify(object)} cardTitle={object.name} typeKey={typeData.key} dataKey={object.key} />;
            })}
        </>
    );
};

export default CardsDisplay;