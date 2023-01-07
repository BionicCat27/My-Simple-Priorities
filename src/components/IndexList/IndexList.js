//React
import React, { useContext } from 'react';
import { NavigationContext } from '../../contexts/NavigationContext';
const IndexList = (props) => {
    const { navigateToPage, setParameters } = useContext(NavigationContext);

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
    if (!datatype || !fields) return null;
    fields = [...fields];
    if (fields.length == 0) return null;

    let objects = props.objects;
    if (!objects) return null;
    if (objects.length == 0) return null;

    return (
        <ul>
            {objects.map((object) => {
                if (object.key == null
                    || !objectHasAllFields(object, fields)) {
                    return null;
                }
                let entries = Object.entries(object);
                return (
                    <li className={"clickable"} key={object.key} onClick={() => {
                        navigateToPage(`#${datatype.target}`);
                        setParameters({ objectKey: object.key });
                    }}>
                        <h3>
                            {object.name}
                        </h3>
                    </li>
                );
            }
            )}
        </ul>
    );
};

export default IndexList;