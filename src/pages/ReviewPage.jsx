//React
import React, { useEffect, useState, useContext } from 'react';
//Contexts
import { DBContext } from '../contexts/DBContext';
//Components
//Styles
import './common.css';
import StatusSelector from './components/StatusSelector';
import NavMenu from './components/NavMenu/NavMenu';
import CardSizeViewSelector from './components/CardSizeViewSelector';
import CardStatusViewSelector from './components/CardStatusViewSelector';
import { EditableInput } from './components/EditableInput';
import { EditableTextarea } from './components/EditableTextarea';

const ReviewPage = (props) => {
    const { ready, addDataListener, pushObject, updateObject } = useContext(DBContext);

    const DEFAULT_STATUS_VIEW = "Planning";
    const DEFAULT_SIZE_VIEW = "Default";

    const [contentList, setContentList] = useState([]);
    const [contentInput, setContentInput] = useState("");
    const [cardSizeView, setCardSizeView] = useState(DEFAULT_SIZE_VIEW);
    const [cardStatusView, setCardStatusView] = useState(DEFAULT_STATUS_VIEW);

    useEffect(() => {
        if (ready) {
            addDataListener(`review`, setContentList);
        }
    }, [ready]);

    function addContent(event) {
        event.preventDefault();
        if (contentInput.length == 0) {
            return;
        }
        pushObject(`review`, {
            title: contentInput,
            description: "",
            progress: [],
            status: "Todo"
        });
        setContentInput("");
    }

    function handleDrop(e, status) {
        let targetKey = e.dataTransfer.getData("key");
        updateObject(`review/${targetKey}`, "status", status);
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function statusMatch(status, targetstatus) {
        if (targetstatus === "All") return true;
        if (targetstatus === "Planning" && (status === "Todo" || status === "In Progress")) return true;
        if (targetstatus === "Focus" && (status === "In Progress" || status === "Done")) return true;
        if (targetstatus === status) return true;
        return false;
    }


    function getStatusBlock(status) {
        return (
            <div className='statusBlock'
                onDrop={(e) => { handleDrop(e, status); }}
                onDragOver={handleDragOver}>

                <h3>{status}</h3>
                {contentList && contentList.map(card => {
                    if (statusMatch(card.status, status)) {
                        return (
                            <ReviewCard
                                card={card}
                                key={`${card.key}${card.title}`}
                                cardSizeView={cardSizeView}
                                cardStatusView={cardStatusView}
                            />
                        );
                    }
                })
                }
            </div>
        );
    }

    return (
        <>
            <NavMenu title="Review" />
            <div id="pageContent">
                <form onSubmit={addContent} id="contentForm">
                    <input value={contentInput} onChange={field => setContentInput(field.target.value)} type="text" className="content_field" />
                    <button id="addContentButton" onClick={addContent}>Add review!</button>
                    <CardSizeViewSelector setCardSizeView={setCardSizeView} cardSizeView={cardSizeView} />
                    <CardStatusViewSelector setCardSizeView={setCardStatusView} cardSizeView={cardStatusView} />
                </form>
                <div className="cards_container">
                    {statusMatch("Todo", cardStatusView) && getStatusBlock("Todo")}
                    {statusMatch("In Progress", cardStatusView) && getStatusBlock("In Progress")}
                    {statusMatch("Done", cardStatusView) && getStatusBlock("Done")}
                </div>
            </div>
        </>
    );
};

const ReviewCard = (props) => {
    const { ready, updateObject, removeObject } = useContext(DBContext);

    const card = props.card;
    const cardSizeView = props.cardSizeView;

    const [isEditing, setEditing] = useState(false);

    const [titleInput, setTitleInput] = useState(card.title || "");
    const [descriptionInput, setDescriptionInput] = useState(card.description || "");
    const [progressInput, setProgressInput] = useState(card.progress || []);
    const [statusInput, setStatusInput] = useState(card.status || "Todo");

    const isDefault = (cardSizeView == "Default");

    const [draggedOver, setDraggedOver] = useState(false);
    const [dragging, setDragging] = useState(false);

    function calculateProgressValue() {
        if (!card.progress || card.progress.length == 0) return 0;

        let value = card.progress.reduce((previousValue, currentValue) => {
            return {
                progress: (parseInt(previousValue.progress) + parseInt(currentValue.progress)),
                total: (parseInt(previousValue.total) + parseInt(currentValue.total)),
            };
        });
        return ((value.progress / value.total) * 100).toFixed(2);
    }

    function updateContent() {
        updateObject(`review/${card.key}`, "title", titleInput);
        updateObject(`review/${card.key}`, "description", descriptionInput);
        updateObject(`review/${card.key}`, "progress", progressInput);
        updateObject(`review/${card.key}`, "status", statusInput);
        setEditing(false);
    }

    function deleteCard() {
        if (confirm(`Delete \"${card.title}\"?`)) {
            removeObject(`review/${card.key}`);
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

    function handleDrop(e) {
        let targetKey = e.dataTransfer.getData("key");

        updateObject(`review/${targetKey}`, "status", card.status);

        setDraggedOver(false);
    }

    function handleDragOver(e) {
        e.preventDefault();
        setDraggedOver(true);
    }

    function handleDragLeave(e) {
        setDraggedOver(false);
    }

    function handleDragStart(e, key, status) {
        e.dataTransfer.setData("key", key);
        e.dataTransfer.setData("status", status);
        setDragging(true);
    }

    function handleDragEnd(e) {
        setDragging(false);
    }

    return (
        <div draggable className={(isDefault ? "condensed_card " : "content_card ") + (dragging ? "brdr-red " : " ") + (draggedOver ? "brdr-blue " : " ")}
            onClick={() => (!isEditing && setEditing(true))}
            onDrop={(e) => { handleDrop(e); }}
            onDragStart={(e) => { handleDragStart(e, card.key, card.status); }}
            onDragEnd={(e) => { handleDragEnd(e); }}
            onDragOver={(e) => { handleDragOver(e); }}
            onDragLeave={(e) => { handleDragLeave(e); }}
            onTouchMove={(e) => { handleDragStart(e, card.key, card.status); }}
            onTouchEnd={(e) => { handleDragEnd(e); }}>
            {isEditing ?
                <>
                    <EditableInput label={"Title"} value={titleInput} setValue={setTitleInput} type="text" />
                    <EditableTextarea label={"Description"} value={descriptionInput} setValue={setDescriptionInput} />
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
                    <StatusSelector value={statusInput} setValue={(value) => setStatusInput(value)} />
                    <div id="formButtonContainer">
                        <button onClick={updateContent}>Save</button>
                        <a id="deleteButton" onClick={deleteCard}>Delete</a>
                    </div>
                </> :
                <>
                    <h3>{card.title}</h3>
                    {!isDefault && <p>{card.description}</p>}
                    <p>{calculateProgressValue()}%</p>
                </>
            }
        </div >
    );
};

export default ReviewPage;