import { useContext, useEffect, useState } from "react";
import { DBContext } from "../contexts/DBContext";
import { Card } from "./components/Card";
import { EditableInput } from "./components/EditableInput";
import NavMenu from "./components/NavMenu/NavMenu";

const CapturePage = () => {
    const { pushObject, ready, addDataListener } = useContext(DBContext);

    const [note, setNote] = useState("");
    const [cards, setNotes] = useState([]);
    const [showNotes, setShowNotes] = useState(false);

    useEffect(() => {
        if (ready) {
            addDataListener("capture", setNotes, true);
        }
    }, [ready]);

    const captureNote = (e) => {
        e.preventDefault();
        if (!note) return;
        pushObject("capture", { value: note });
        setNote("");
    };

    return (
        <div id="pageContent">
            <div id="capture-page">
                <div id="capture-page-content">
                    <form onSubmit={captureNote}>
                        <input
                            autoFocus
                            id="capture-input"
                            name=""
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        ></input>
                    </form>
                    <button className="quiet-button" id="capture-see_notes" onClick={() => setShowNotes(!showNotes)}>
                        {showNotes ? "Hide notes" : "See notes"}
                    </button>
                    {showNotes &&
                        <div>
                            {cards ? cards.map((card) => {
                                return (
                                    <CaptureCard key={`${card.key}${card.value}`} card={card} />
                                );
                            }) : <p>No notes found.</p>}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

const CaptureCard = (props) => {
    const { updateObject, pushObject, removeObject } = useContext(DBContext);

    const card = props.card;
    const cardPath = `capture/${card.key}`;
    const [value, setValue] = useState(card.value);

    if (!card) return;

    function updateContent() {
        updateObject(cardPath, "value", value);
    }

    function resetContent() {
        setValue(card.value);
    }

    function createTodo() {
        //Create todo
        pushObject(`todo`, {
            title: card.value,
            status: "Todo"
        });
        //Delete note
        removeObject(cardPath);
    }

    return (
        <Card
            card={card}
            cardClasses="capture_card"
            updateContent={updateContent}
            resetContent={resetContent}
            cardPath={cardPath}
            viewComponent={
                <h3>{card.value}</h3>
            }
            editComponent={
                <>
                    <EditableInput label={"Value"} value={value} setValue={setValue} />
                    <button onClick={createTodo}>Turn into Todo</button>
                </>
            }
        />
    );
};

export default CapturePage;