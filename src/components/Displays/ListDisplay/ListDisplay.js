//React
import React from 'react';
const ListDisplay = (props) => {

    const objects = props.objects;

    if (!objects || objects.length < 1) {
        return null;
    }
    return (
        <ul>
            {objects.map((object) => {
                return <li>{JSON.stringify(object)}</li>;
            })}
        </ul>
    );
};

export default ListDisplay;