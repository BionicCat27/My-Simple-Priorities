import React, { useEffect, useState } from "react";

import './ContentCard.css';

const ContentCard = (props) => {
    const initialTitle = props.title || "";
    const initialDescription = props.description || "";
    const initialProgress = props.progress || [];
    const initialStatus = props.status || "Todo";

    if (
        (props.cardStatusView == "Planning" && initialStatus == "Done")
        || (props.cardStatusView == "Todo" && (initialStatus == "In Progress" || initialStatus == "Done"))
        || (props.cardStatusView == "In Progress" && (initialStatus == "Todo" || initialStatus == "Done"))
        || (props.cardStatusView == "Done" && (initialStatus == "Todo" || initialStatus == "In Progress"))
    ) return null;

    const [showButtons, setShowButtons] = useState(false);
    const [isEditing, setEditing] = useState(false);
    const [cardType, setCardType] = useState(props.cardType);

    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [progress, setProgress] = useState(initialProgress);
    const [status, setStatus] = useState(initialStatus);

    const [titleInput, setTitleInput] = useState(initialTitle);
    const [descriptionInput, setDescriptionInput] = useState(initialDescription);
    const [progressInput, setProgressInput] = useState(initialProgress);
    const [progressValue, setProgressValue] = useState(calculateProgressValue());
    const [statusInput, setStatusInput] = useState(initialStatus);


    const isPriorityCard = (cardType == "priority");
    const isTodoCard = (cardType == "todo");
    const isReviewCard = (cardType == "review");

    const isCondensed = (props.cardSizeView == "condensed");

    useEffect(() => {
        if (title == undefined) {
            setTitle("");
            setTitleInput("");
        }
        if (description == undefined) {
            setDescription("");
            setDescriptionInput("");
        }

        if (progress) {
            setProgressInput(progress);
            setProgressValue(calculateProgressValue());
        }

        if (status) {
            setStatusInput(status);
        }

        let value;
        if (cardType == "priority") {
            value = {
                title: title,
                description: description,
            };
        } else if (cardType == "todo") {
            value = {
                title: title,
                description: description,
                status: status
            };
        } else if (cardType == "review") {
            value = {
                title: title,
                description: description,
                progress: progress,
                status: status
            };
        }
        props.updateCard(props.index, value);
    }, [title, description, progress, status]);

    function calculateProgressValue() {
        if (!progress) {
            return;
        }

        let progressVal = progress.reduce((previousValue, currentValue) => {
            return parseInt(previousValue) + parseInt(currentValue.progress);
        }, 0);
        let totalVal = progress.reduce((previousValue, currentValue) => {
            return parseInt(previousValue) + parseInt(currentValue.total);
        }, 0);
        return ((progressVal / totalVal) * 100).toFixed(2);
    }

    function updateContent() {
        setTitle(titleInput);
        setDescription(descriptionInput);
        setProgress(progressInput);
        setStatus(statusInput);
        setEditing(false);
    }

    function deleteCard() {
        let result = confirm(`Delete \"${title}\"?`);
        if (result) {
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
        console.log("Attempting remove stage at: " + index);
        let workingArray = [...progressInput];
        workingArray.splice(index, 1);
        setProgressInput(workingArray);
    }

    if (isEditing) {
        return (
            <div className={isCondensed ? "condensed_card" : "content_card"} onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
                {(isPriorityCard || isTodoCard || isReviewCard) &&
                    <>
                        <label htmlFor="contentTitleInput">Title</label>
                        <input id="contentTitleInput" className="margin-y-1" onChange={field => setTitleInput(field.target.value)} value={titleInput}></input>
                        <label htmlFor="contentDescriptionInput">Description</label>
                        <textarea id="contentDescriptionInput" className="margin-y-1" onChange={field => setDescriptionInput(field.target.value)} value={descriptionInput}></textarea>
                    </>}
                {(isReviewCard) &&
                    <>
                        {
                            progressInput.map((progressObject, index) => {
                                if (!progressObject) {
                                    console.log("No object, returning");
                                    return;
                                }
                                return (
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
                                );
                            })
                        }
                        <p onClick={handleAddStage}>Add progress stage</p>
                    </>
                }
                {!isPriorityCard && status &&
                    <>
                        <p>Status: {statusInput}</p>
                        <div id="formButtonContainer">
                            <button onClick={() => { setStatusInput("Todo"); }}>Todo</button>
                            <button onClick={() => { setStatusInput("In Progress"); }}>In Progress</button>
                            <button onClick={() => { setStatusInput("Done"); }}>Done</button>
                        </div>
                    </>
                }
                <div id="formButtonContainer">
                    <button onClick={updateContent}>Save</button>
                    <a id="deleteButton" onClick={deleteCard}>Delete</a>
                </div>
            </div >
        );
    }
    return (
        <div className={isCondensed ? "condensed_card" : "content_card"} onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
            {(isPriorityCard || isTodoCard || isReviewCard) &&
                <>
                    {!isCondensed ? <h3>{title}</h3> : <h3>{title}</h3>}
                    {!isCondensed && <p>{description}</p>}
                </>}
            {(isReviewCard) && progress &&
                <p>{progressValue}%</p>}
            {showButtons &&
                <div id="contentButtonContainer">
                    <button onClick={() => setEditing(true)}>Edit</button>
                    <button onClick={() => props.moveCard(props.index, props.index - 1)}>Up</button>
                    <button onClick={() => props.moveCard(props.index, props.index + 1)}>Down</button>
                </div>
            }
        </div >
    );
};

export default ContentCard;