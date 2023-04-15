//React
import { push, ref, set } from 'firebase/database';
import React, { useContext, useEffect, useState } from 'react';
import { DBContext } from '../../contexts/DBContext';
import DisplaySelector from './DisplaySelector/DisplaySelector';
import EditableDisplay from './EditableDisplay/EditableDisplay';
const EditViewDisplaysList = (props) => {
    const { database } = useContext(DBContext);

    const [displays, setDisplays] = useState(props.displays);
    const dbRef = props.dbRef;
    const viewRef = props.viewRef;
    const changeValue = props.changeValue;
    const parentKey = props.parentKey;

    useEffect(() => { setDisplays(props.displays); }, [props.displays]);


    function addDisplay(displayKey) {
        let obj = { display: displayKey };

        let res = set(push(ref(database, `${viewRef}/displays/`)), obj);
    }

    if (!displays || displays.length < 1) {
        return (
            <>
                <p><b>Displays</b></p>
                <DisplaySelector addDisplay={addDisplay} />
            </>
        );
    }
    if (!displays.length) {
        let display = displays;
        return (
            <>
                <p><b>Displays</b></p>
                <DisplaySelector addDisplay={addDisplay} />
                <EditableDisplay display={display} displayRef={`${viewRef}/displays/${display.key}`} />
            </>
        );
    }
    return (
        <>
            <h2>Displays</h2>
            <DisplaySelector addDisplay={addDisplay} />
            {displays.map((display, index) => {
                return <EditableDisplay key={`${index}${JSON.stringify(display.display)}`} display={display} displayRef={`${viewRef}/displays/${display.key}`} />;
            })}
        </>
    );
};

export default EditViewDisplaysList;