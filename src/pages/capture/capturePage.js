import React, { useContext, useState } from "react";
import NavMenu from "../../components/NavMenu/NavMenu";
import '../common.css';
import {DBContext} from '../../contexts/DBContext'

const CapturePage = () => {
    const {pushObject} = useContext(DBContext);

    const [note, setNote] = useState("");

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
                        <button>See notes</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CapturePage;