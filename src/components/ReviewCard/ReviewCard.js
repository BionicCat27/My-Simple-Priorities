import React, { useEffect, useState } from "react";
import { ref, update, getDatabase } from "firebase/database";

import './ReviewCard.css';

const ReviewCard = (props) => {
    const initialTitle = props.title || "";
    const initialDescription = props.description || "";
    const initialProgress = props.progress || [];
    const initialStatus = props.status || "Todo";

    const [showButtons, setShowButtons] = useState(false);
    const [isEditing, setEditing] = useState(false);
    const cardSizeView = props.cardSizeView;

    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [progress, setProgress] = useState(initialProgress);
    const [status, setStatus] = useState(initialStatus);

    const [titleInput, setTitleInput] = useState(initialTitle);
    const [descriptionInput, setDescriptionInput] = useState(initialDescription);
    const [progressInput, setProgressInput] = useState(initialProgress);
    const [progressValue, setProgressValue] = useState(calculateProgressValue());
    const [statusInput, setStatusInput] = useState(initialStatus);

    const isDefault = (cardSizeView == "Default");

    const [draggedOver, setDraggedOver] = useState(false);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        if (props.user) {
            update(ref(props.database, 'users/' + props.user.uid + '/review/' + props.index), {
                title: title
            });
            return;
        }
        console.log("Bad user!");
    }, [title]);

    useEffect(() => {
        if (props.user) {
            update(ref(props.database, 'users/' + props.user.uid + '/review/' + props.index), {
                description: description
            });
            return;
        }
        console.log("Bad user!");
    }, [description]);

    useEffect(() => {
        if (props.user) {
            update(ref(props.database, 'users/' + props.user.uid + '/review/' + props.index), {
                progress: progress
            });
            return;
        }
        console.log("Bad user!");
    }, [progress]);

    useEffect(() => {
        if (props.user) {
            update(ref(props.database, 'users/' + props.user.uid + '/review/' + props.index), {
                status: status
            });
            return;
        }
        console.log("Bad user!");
    }, [status]);

    function calculateProgressValue() {
        if (!progress || progress.length == 0) return;

        let value = progress.reduce((previousValue, currentValue) => {
            return {
                progress: (parseInt(previousValue.progress) + parseInt(currentValue.progress)),
                total: (parseInt(previousValue.total) + parseInt(currentValue.total)),
            };
        });
        return ((value.progress / value.total) * 100).toFixed(2);
    }

    function updateContent() {
        setTitle(titleInput);
        setDescription(descriptionInput);
        setProgress(progressInput);
        setStatus(statusInput);
        setEditing(false);
        setShowButtons(false);
    }

    function deleteCard() {
        if (confirm(`Delete \"${title}\"?`)) {
            props.deleteCard(props.index);
            setEditing(false);
        } else {
            console.log("Not deleting");
        }
    }

    function handleTotalInput(value, index) {
        let workingArray = [...progressInput];
        workingArray[index].total = value;
        setProgressInput(workingArray);
    }

    function handleProgressInput(value, index) {
        let workingArray = [...progressInput];
        workingArray[index].progress = value;
        setProgressInput(workingArray);
    }

    function handleAddStage() {
        setProgressInput([...progressInput, {
            progress: 0,
            total: 100
        }]);
    }

    function handleRemoveStage(index) {
        let workingArray = [...progressInput];
        workingArray.splice(index, 1);
        setProgressInput(workingArray);
    }

    function generateCardContent() {
        if (isEditing) {
            return (<>
                <label htmlFor="contentTitleInput">Title</label>
                <input id="contentTitleInput" className="margin-y-1" onChange={field => setTitleInput(field.target.value)} value={titleInput}></input>
                <label htmlFor="contentDescriptionInput">Description</label>
                <textarea id="contentDescriptionInput" className="margin-y-1" onChange={field => setDescriptionInput(field.target.value)} value={descriptionInput}></textarea>
                {progressInput.map((progressObject, index) => (
                    <div key={`${index}Container`}>
                        <div className="inlineContainer" key={`${index}ProgressContainer`}>
                            <label htmlFor="contentProgressInput" key={`${index}ProgressLabel`}>Progress</label>
                            <input id="contentProgressInput" className="margin-y-1" type="number" max="100" key={`${index}ProgressInput`} onChange={field => handleProgressInput(field.target.value, index)} value={progressObject.progress}></input>
                        </div>
                        <div className="inlineContainer" key={`${index}TotalContainer`}>
                            <label htmlFor="contentTotalInput" key={`${index}TotalLabel`}>Total</label>
                            <input id="contentTotalInput" className="margin-y-1" type="number" max="100" key={`${index}TotalInput`} onChange={field => handleTotalInput(field.target.value, index)} value={progressObject.total}></input>
                        </div>
                        <div className="inlineContainer" key={`${index}RemoveContainer`}>
                            <p onClick={() => handleRemoveStage(index)} >Remove</p>
                        </div>
                    </div>
                ))}
                <p onClick={handleAddStage}>Add progress stage</p>
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
                {progressValue && <p>{progressValue}%</p>}
            </>);
        }
    }

    function handleDrop(e, index) {
        let targetIndex = e.dataTransfer.getData("index");
        let targetStatus = e.dataTransfer.getData("status");

        if (targetStatus === status) {
            props.moveCard(targetIndex, index);
        } else {
            update(ref(props.database, 'users/' + props.user.uid + '/' + cardType + '/' + targetIndex), {
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
            onMouseEnter={() => setShowButtons(true)}
            onMouseLeave={() => setShowButtons(false)}
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

export default ReviewCard;