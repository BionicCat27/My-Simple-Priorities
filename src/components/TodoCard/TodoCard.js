import React, { useEffect, useState } from "react";
import { ref, update, getDatabase } from "firebase/database";

import './TodoCard.css';

const TodoCard = (props) => {
    const initialTitle = props.title || "";
    const initialDescription = props.description || "";
    const initialStatus = props.status || "Todo";

    const [isEditing, setEditing] = useState(false);
    const cardSizeView = props.cardSizeView;

    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [status, setStatus] = useState(initialStatus);

    const [titleInput, setTitleInput] = useState(initialTitle);
    const [descriptionInput, setDescriptionInput] = useState(initialDescription);
    const [statusInput, setStatusInput] = useState(initialStatus);

    const isDefault = (cardSizeView == "Default");

    const [draggedOver, setDraggedOver] = useState(false);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        if (props.user) {
            update(ref(props.database, 'users/' + props.user.uid + '/todo/' + props.index), {
                title: title
            });
            return;
        }
        console.log("Bad user!");
    }, [title]);

    useEffect(() => {
        if (props.user) {
            update(ref(props.database, 'users/' + props.user.uid + '/todo/' + props.index), {
                description: description
            });
            return;
        }
        console.log("Bad user!");
    }, [description]);

    useEffect(() => {
        if (props.user) {
            update(ref(props.database, 'users/' + props.user.uid + '/todo/' + props.index), {
                status: status
            });
            return;
        }
        console.log("Bad user!");
    }, [status]);

    function updateContent() {
        setTitle(titleInput);
        setDescription(descriptionInput);
        setStatus(statusInput);
        setEditing(false);
    }

    function deleteCard() {
        if (confirm(`Delete \"${title}\"?`)) {
            props.deleteCard(props.index);
            setEditing(false);
        } else {
            console.log("Not deleting");
        }
    }

    function generateCardContent() {
        if (isEditing) {
            return (<>
                <label htmlFor="contentTitleInput">Title</label>
                <input id="contentTitleInput" className="margin-y-1" onChange={field => setTitleInput(field.target.value)} value={titleInput}></input>
                <label htmlFor="contentDescriptionInput">Description</label>
                <textarea id="contentDescriptionInput" className="margin-y-1" onChange={field => setDescriptionInput(field.target.value)} value={descriptionInput}></textarea>
                <p>Status: {statusInput}</p>
                <div id="formButtonContainer">
                    <button onClick={() => { setStatusInput("Todo"); }}>Todo</button>
                    <button onClick={() => { setStatusInput("In Progress"); }}>In Progress</button>
                    <button onClick={() => { setStatusInput("Done"); }}>Done</button>
                </div>
                <div id="formButtonContainer">
                    <button onClick={updateContent}>Save</button>
                    <a id="deleteButton" onClick={deleteCard}>Delete</a>
                </div>
            </>);
        } else {
            return (<>
                <h3>{title}</h3>
                {!isDefault && <p>{description}</p>}
            </>);
        }
    }

    function handleDrop(e, index) {
        let targetIndex = e.dataTransfer.getData("index");
        let targetStatus = e.dataTransfer.getData("status");

        if (targetStatus === status) {
            props.moveCard(targetIndex, index);
        } else {
            update(ref(props.database, 'users/' + props.user.uid + '/todo/' + targetIndex), {
                status: status
            });
        }

        setDraggedOver(false);
    }

    function handleDragOver(e) {
        e.preventDefault();
        setDraggedOver(true);
    }

    function handleDragLeave(e) {
        setDraggedOver(false);
    }

    function handleDragStart(e, index, status) {
        e.dataTransfer.setData("index", index);
        e.dataTransfer.setData("status", status);
        setDragging(true);
    }

    function handleDragEnd(e) {
        setDragging(false);
    }

    return (
        <div draggable className={(isDefault ? "condensed_card " : "content_card ") + (dragging ? "brdr-red " : " ") + (draggedOver ? "brdr-blue " : " ")}
            onClick={() => (!isEditing && setEditing(true))}
            onDrop={(e) => { handleDrop(e, props.index); }}
            onDragStart={(e) => { handleDragStart(e, props.index, props.status); }}
            onDragEnd={(e) => { handleDragEnd(e); }}
            onDragOver={(e) => { handleDragOver(e); }}
            onDragLeave={(e) => { handleDragLeave(e); }}
            onTouchMove={(e) => { handleDragStart(e, props.index, props.status); }}
            onTouchEnd={(e) => { handleDragEnd(e); }}>
            {generateCardContent()}
        </div >
    );
};

export default TodoCard;