//React
import React from 'react';
import TypesTableFormRow from './TypesTableFormRow/TypesTableFormRow';
const TypesTable = (props) => {
    let types = [...props.types];
    console.log("Table:" + JSON.stringify(types) + " : " + !types + " " + types.length);
    if (!types || types.length == 0) return (
        <>
            <table>
                <tbody>
                    <TypesTableFormRow />
                </tbody>
            </table>
            <h2>No types</h2>
        </>
    );
    return (
        <table>
            <tbody>
                <TypesTableFormRow />
                {types.map((type) => {
                    if (type.name == null
                        && type.description == null) {
                        return null;
                    }
                    return (
                        <tr>
                            <td>{type.name}</td>
                            <td>{type.description}</td>
                        </tr>
                    );
                }
                )}
            </tbody>
        </table>
    );
};

export default TypesTable;