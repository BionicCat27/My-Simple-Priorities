import React, { useEffect, useState } from "react";

import './ContentCard.css';

const ContentCard = (props) => {
    const [showButtons, setShowButtons] = useState(false);
    const [isEditing, setEditing] = useState(false);
    const [cardType, setCardType] = useState(props.cardType);

    const [title, setTitle] = useState(props.title);
    const [description, setDescription] = useState(props.description);
    const [progress, setProgress] = useState(props.progress);

    const [titleInput, setTitleInput] = useState(props.title);
    const [descriptionInput, setDescriptionInput] = useState(props.description);
    const [progressInput, setProgressInput] = useState(props.progress);

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
                progress: progressInput
            };
        }
        props.updateCard(props.index, value);
    }, [title, description, progress]);

    function updateContent() {
        setTitle(titleInput);
        setDescription(descriptionInput);
        setProgress([progressInput]);
        setEditing(false);
    }

    if (isEditing) {
        return (
            <div id="contentCard" onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
                <div id="contentContainer">
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
                        </>}
                </div>
                <div id="contentButtonContainer">
                    <button onClick={updateContent}>Done</button>
                </div>
            </div>
        );
    }
    return (
        <div id="contentCard" onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
            <div id="contentContainer">
                {(isPriorityCard || isTodoCard || isReviewCard) &&
                    <>
                        <h3 onClick={() => setEditing(true)}>{title}</h3>
                        <p>{description}</p>
                    </>}
                {(isReviewCard) && progress > 0 &&
                    <p>{progress}%</p>}
            </div>
            {showButtons &&
                <div id="contentButtonContainer">
                    <div>
                        <button onClick={() => setEditing(true)}>Edit</button>
                        <button onClick={() => props.moveCard(props.index, props.index - 1)}>Up</button>
                        <button onClick={() => props.moveCard(props.index, props.index + 1)}>Down</button>
                        <button onClick={() => props.deleteCard(props.index)}>Delete</button>
                    </div>
                </div>
            }
        </div >
    );
};

export default ContentCard;