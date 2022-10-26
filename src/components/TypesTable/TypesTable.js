//React
import React from 'react';
import TypesTableFormRow from './TypesTableFormRow/TypesTableFormRow';
const TypesTable = (props) => {
    const NoViewContent = () => {
        return (
            <>
                <table>
                    <tbody>
                        <TypesTableFormRow />
                    </tbody>
                </table>
                <h2>No types</h2>
            </>
        );
    };

    let types = props.types;
    if (!types) return <NoViewContent />;
    types = [...props.types];
    if (types.length == 0) return <NoViewContent />;
    return (
        <table>
            <tbody>
                <TypesTableFormRow />
                {types.map((type) => {
                    if (type.name == null
                        && type.description == null
                        && type.key == null) {
                        return null;
                    }
                    return (
                        <tr key={type.key}>
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