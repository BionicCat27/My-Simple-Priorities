//React
import { ref, remove } from 'firebase/database';
import React, { useContext } from 'react';
import { DBContext } from '../../../contexts/DBContext';
import EditableCardsDisplay from '../../Displays/CardsDisplay/EditableCardsDisplay';
import EditableListDisplay from '../../Displays/ListDisplay/EditableListDisplay';
const EditableDisplay = (props) => {

    const { database } = useContext(DBContext);

    const display = props.display;
    const displayRef = props.displayRef;

    function removeDisplay() {
        remove(ref(database, displayRef));
    }

    function generateDisplay() {
        switch (display.display) {
            case 'listDisplay':
                return <EditableListDisplay display={display} displayRef={displayRef} />;
                break;
            case 'cardsDisplay':
                return <EditableCardsDisplay display={display} displayRef={displayRef} />;
                break;
            default:
                return <p>Invalid Display</p>;
                break;
        }
    }

    return (
        <div className="content_card">
            {generateDisplay()}
            <p className={"clickable remove_button"} onClick={() => removeDisplay()}>Remove</p>
        </div>
    );
};

export default EditableDisplay;