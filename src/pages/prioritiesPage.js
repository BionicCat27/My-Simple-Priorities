//React
import React, { useEffect, useState, useContext } from 'react';
//Contexts
import { DBContext } from '../contexts/DBContext';
//Components
import NavMenu from '../components/NavMenu/NavMenu';
//Styles
import './common.css';

const PrioritiesPage = (props) => {
    const { ready, addDataListener, pushObject } = useContext(DBContext);

    const DEFAULT_SIZE_VIEW = "Default";

    const [contentList, setContentList] = useState([]);
    const [contentInput, setContentInput] = useState("");
    const [cardSizeView, setCardSizeView] = useState(DEFAULT_SIZE_VIEW);

    useEffect(() => {
        if(ready) {
            addDataListener("priorities", setContentList)
        }
    }, [ready])

    function addContent(event) {
        event.preventDefault();
        if (contentInput.length == 0) {
            return;
        }
        pushObject(`priorities`, {
            title: contentInput,
            description: "",
            hours: 0
        })
        setContentInput("");
    }

    function getTotalHours() {
        if (!contentList) return 0;
        return contentList.reduce((totalHours, card) => {
            if (!card.hours) return totalHours;
            return totalHours + parseInt(card.hours);
        }, 0)
    }

    return (
        <>
            <NavMenu title="Priorities" />
            <div id="pageContent">
                <form onSubmit={addContent} id="contentForm">
                    <input value={contentInput} onChange={field => setContentInput(field.target.value)} type="text" className="content_field" />
                    <button id="addContentButton" onClick={addContent}>Add priority!</button>
                    <select onChange={field => setCardSizeView(field.target.value)} value={cardSizeView}>
                        <option>Default</option>
                        <option>Expanded</option>
                        <option>List</option>
                    </select>
                    <h3>Expected weekly hours: {getTotalHours()}/168</h3>
                </form>
                <div className="cards_container">
                    {contentList && contentList.map(card => 
                    <PrioritiesCard
                        card={card}
                        key={`${card.key}/${card.title}`}
                        cardSizeView={cardSizeView}
                    />)}
                </div>
            </div>
        </>
    );
};

const PrioritiesCard = (props) => {
    const { ready, updateObject, removeObject } = useContext(DBContext);

    const card = props.card;
    const cardSizeView = props.cardSizeView;

    const [isEditing, setEditing] = useState(false);
    
    const [titleInput, setTitleInput] = useState(card.title || "");
    const [descriptionInput, setDescriptionInput] = useState(card.description || "");
    const [hoursInput, setHoursInput] = useState(card.hours || 0);

    const [draggedOver, setDraggedOver] = useState(false);
    const [dragging, setDragging] = useState(false);

    function updateContent() {
        if (!ready) return;
        updateObject(`priorities/${card.key}`, "title", titleInput)
        updateObject(`priorities/${card.key}`, "description", descriptionInput)
        updateObject(`priorities/${card.key}`, "hours", hoursInput)

        setEditing(false);
    }

    function deleteCard() {
        if (confirm(`Delete \"${card.title}\"?`)) {
            removeObject(`priorities/${card.key}`)
            setEditing(false);
        } else {
            console.log("Not deleting");
        }
    }

    function handleDrop(e, index) {
        let targetIndex = e.dataTransfer.getData("index");
        let targetStatus = e.dataTransfer.getData("status");

        if (targetStatus === status) {
            props.moveCard(targetIndex, index);
        } else {
            update(ref(props.database, 'users/' + props.user.uid + '/priorities/' + targetIndex), {
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
        <div draggable className={(cardSizeView == "Default" ? "condensed_card " : "content_card ") + (dragging ? "brdr-red " : " ") + (draggedOver ? "brdr-blue " : " ")}
            onClick={() => (!isEditing && setEditing(true))}
            onDrop={(e) => { handleDrop(e, props.index); }}
            onDragStart={(e) => { handleDragStart(e, props.index, props.status); }}
            onDragEnd={(e) => { handleDragEnd(e); }}
            onDragOver={(e) => { handleDragOver(e); }}
            onDragLeave={(e) => { handleDragLeave(e); }}
            onTouchMove={(e) => { handleDragStart(e, props.index, props.status); }}
            onTouchEnd={(e) => { handleDragEnd(e); }}>
            { isEditing ?
            <>
                <label htmlFor="contentTitleInput">Title</label>
                <input id="contentTitleInput" className="margin-y-1" onChange={field => setTitleInput(field.target.value)} value={titleInput}></input>
                <label htmlFor="contentDescriptionInput">Description</label>
                <textarea id="contentDescriptionInput" className="margin-y-1" onChange={field => setDescriptionInput(field.target.value)} value={descriptionInput}></textarea>
                <label htmlFor="contentHoursInput">Hours</label>
                <input id="contentHoursInput" className="margin-y-1" onChange={field => setHoursInput(field.target.value)} value={hoursInput}></input>
                <div id="formButtonContainer">
                    <button onClick={updateContent}>Save</button>
                    <a id="deleteButton" onClick={deleteCard}>Delete</a>
                </div>
            </> :
            <div className="cardContentContainer">
                <div id="col1">
                    <h3>{card.title}</h3>
                    {cardSizeView != "Default" && <p>{card.description}</p>}
                </div>
                <div id="col2">
                    <p id="hoursDisplay">{card?.hours}</p>
                </div>
            </div>
            }
        </div >
    );
};

export default PrioritiesPage;