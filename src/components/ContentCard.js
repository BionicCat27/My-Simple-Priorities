import React, { useEffect, useState } from "react";

import './ContentCard.css';

const ContentCard = (props) => {

    const initialTitle = props.title || "";
    const initialDescription = props.description || "";
    const initialProgress = props.progress || "";
    const initialTotal = props.total || "";

    const [showButtons, setShowButtons] = useState(false);
    const [isEditing, setEditing] = useState(false);
    const [cardType, setCardType] = useState(props.cardType);

    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [progress, setProgress] = useState(initialProgress);
    const [total, setTotal] = useState(initialTotal);

    const [titleInput, setTitleInput] = useState(initialTitle);
    const [descriptionInput, setDescriptionInput] = useState(initialDescription);
    const [progressInput, setProgressInput] = useState(initialProgress);
    const [totalInput, setTotalInput] = useState(initialTotal);

    const isPriorityCard = (cardType == "priority");
    const isTodoCard = (cardType == "todo");
    const isReviewCard = (cardType == "review");

    useEffect(() => {
        if (title == undefined) {
            setTitle("");
            setTitleInput("");
        }
        if (description == undefined) {
            setDescription("");
            setDescriptionInput("");
        }
        if (progress == undefined || progress == []) {
            setProgress([]);
            setProgressInput();
        }

        if (total == undefined) {
            setTotal([]);
            setTotalInput();
        }

        let value;
        if (cardType == "priority") {
            value = {
                title: titleInput,
                description: descriptionInput,
            };
        } else if (cardType == "todo") {
            value = {
                title: titleInput,
                description: descriptionInput,
            };
        } else if (cardType == "review") {
            value = {
                title: titleInput,
                description: descriptionInput,
                progress: [progressInput],
                total: [totalInput]
            };
        }
        props.updateCard(props.index, value);
    }, [title, description, progress, total]);

    function updateContent() {
        setTitle(titleInput);
        setDescription(descriptionInput);
        setProgress([progressInput]);
        setTotal([totalInput]);
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

    if (isEditing) {
        return (
            <div id="contentCard" onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
                {(isPriorityCard || isTodoCard || isReviewCard) &&
                    <>
                        <label htmlFor="contentTitleInput">Title</label>
                        <input id="contentTitleInput" className="margin-y-1" onChange={field => setTitleInput(field.target.value)} value={titleInput}></input>
                        <label htmlFor="contentDescriptionInput">Description</label>
                        <textarea id="contentDescriptionInput" className="margin-y-1" onChange={field => setDescriptionInput(field.target.value)} value={descriptionInput}></textarea>
                    </>}
                {(isReviewCard) &&
                    <>
                        <label htmlFor="contentProgressInput">Progress</label>
                        <input id="contentProgressInput" className="margin-y-1" type="number" max="100" onChange={field => setProgressInput(field.target.value)} value={progressInput}></input>
                        <label htmlFor="contentTotalInput">Total</label>
                        <input id="contentTotalInput" className="margin-y-1" type="number" max="100" onChange={field => setTotalInput(field.target.value)} value={totalInput}></input>
                    </>}
                <div id="contentButtonContainer">
                    <button onClick={updateContent}>Done</button>
                    <a id="deleteButton" onClick={deleteCard}>Delete</a>
                </div>
            </div >
        );
    }
    return (
        <div id="contentCard" onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
            {(isPriorityCard || isTodoCard || isReviewCard) &&
                <>
                    <h3>{title}</h3>
                    <p>{description}</p>
                </>}
            {(isReviewCard) && progress && total &&
                <p>{((progress[0] / total[0]) * 100).toFixed(2)}%</p>}
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