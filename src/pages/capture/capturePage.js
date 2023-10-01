import React, { useContext, useEffect, useState } from "react";
import NavMenu from "../../components/NavMenu/NavMenu";
import '../common.css';
import {DBContext} from '../../contexts/DBContext'

const CapturePage = () => {
    const {pushObject, ready, addDataListener} = useContext(DBContext);

    const [note, setNote] = useState("");
    const [notes, setNotes] = useState([])
    const [showNotes, setShowNotes] = useState(false);

    useEffect(() => {
        if (ready) {
            addDataListener("capture", setNotes);   
        }
    }, [ready])

    useEffect(() => {
        console.log(`Notes: ${JSON.stringify(notes)}`)
    }, [notes])

    const captureNote = (e) => {
        e.preventDefault();
        pushObject("capture", {value: note});
        setNote("");
    }

    return (
        <>
            <NavMenu title="Capture" />
            <div id="pageContent">
                <div id="capture-page">
                    <div id="capture-page-content">
                        <form onSubmit={captureNote}>
                            <input
                                id="capture-input"
                                name=""
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Capture note"
                            ></input>
                            <button type="submit">+</button>
                        </form>
                        <button id="capture-see_notes" onClick={() => setShowNotes(!showNotes)}>
                            {showNotes ? "Hide notes" : "See notes"}
                        </button>
                        {showNotes && 
                        <div>
                            {notes ? Object.keys(notes).map((noteKey, index) => {
                                return (
                                    <div className="card column-card" key={index}>
                                        <button>Task</button>
                                        <p className="capture-note_text">{notes[noteKey]["value"]}</p>
                                        <button>Note</button>
                                    </div>
                                )}) : <p>No notes found.</p>}
                        </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CapturePage;