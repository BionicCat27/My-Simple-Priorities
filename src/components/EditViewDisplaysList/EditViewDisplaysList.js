//React
import React, { useContext, useEffect, useState } from 'react';
import DisplaySelector from './DisplaySelector/DisplaySelector';
import EditableDisplay from './EditableDisplay/EditableDisplay';
const EditViewDisplaysList = (props) => {

    const [displays, setDisplays] = useState(props.displays);
    const dbRef = props.dbRef;
    const changeValue = props.changeValue;

    useEffect(() => { setDisplays(props.displays); }, [props.displays]);


    function addDisplay(displayKey) {
        let newDisplaysList = [];
        if (displays && displays.length > 0) {
            newDisplaysList = [...displays];
        }

        newDisplaysList.push({ display: displayKey });
        changeValue("displays", newDisplaysList);
    }

    console.log(`List of displays: ${displays}`);
    if (!displays || displays.length < 1) {
        return (
            <>
                <p><b>Displays</b></p>
                <DisplaySelector addDisplay={addDisplay} />
            </>
        );
    }
    return (
        <>
            <p><b>Displays</b></p>
            {displays.map((display, index) => {
                console.log("Rendering display: " + display);
                return <EditableDisplay key={`${index}${JSON.stringify(display.display)}`} display={display} />;
            })}
            <DisplaySelector addDisplay={addDisplay} />
        </>
    );
};

export default EditViewDisplaysList;