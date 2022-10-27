//React
import React from 'react';
import IndexTableFormRow from './IndexTableFormRow';
const IndexTable = (props) => {

    const NoContent = () => {
        return (
            <>
                <table>
                    <tbody>
                        <IndexTableFormRow datatype={datatype} fields={fields} />
                    </tbody>
                </table>
            </>
        );
    };

    const objectHasAllFields = (object, fields) => {
        for (const field of fields) {
            if (object[field.field] == null) {
                return false;
            }
        }
        return true;
    };

    let datatype = props.datatype;
    let fields = props.fields;
    if (!datatype || !fields) return <NoContent />;
    fields = [...fields];
    if (fields.length == 0) return <NoContent />;

    let objects = props.objects;
    if (!objects) return <NoContent />;
    if (objects.length == 0) return <NoContent />;

    return (
        <table>
            <tbody>
                <IndexTableFormRow datatype={datatype} fields={fields} />
                {objects.map((object) => {
                    if (object.key == null
                        || !objectHasAllFields(object, fields)) {
                        return null;
                    }
                    let entries = Object.entries(object);
                    return (
                        <tr key={object.key}>
                            {fields.map((field) => {
                                let key = field.field;
                                let value = object[key];
                                if (key == "key") return null;
                                return <td key={`${object.key}${key}`}>{value}</td>;
                            })}
                        </tr>
                    );
                }
                )}
            </tbody>
        </table>
    );
};

export default IndexTable;