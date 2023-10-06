//React
import React, { useEffect, useState, useContext } from 'react';
//Firebase
//Contexts
import { DBContext } from '../contexts/DBContext';
//Components
//Styles
import './common.css'
import NavMenu from './components/NavMenu/NavMenu';
import StatusSelector from './components/StatusSelector';

const TodoPage = (props) => {
    const { ready, addDataListener, pushObject, updateObject } = useContext(DBContext);

    const DEFAULT_STATUS_VIEW = "Planning";
    const DEFAULT_SIZE_VIEW = "Default";

    const [contentList, setContentList] = useState([]);
    const [contentInput, setContentInput] = useState("");
    const [cardSizeView, setCardSizeView] = useState(DEFAULT_SIZE_VIEW);
    const [cardStatusView, setCardStatusView] = useState(DEFAULT_STATUS_VIEW);

    useEffect(() => {
        if(ready) {
            addDataListener(`todo`, setContentList)
        }
    }, [ready])

    function addContent(event) {
        event.preventDefault();
        if (contentInput.length == 0) {
            return;
        }
        pushObject(`todo`, {
            title: contentInput,
            description: "",
            status: "Todo",
            checklist: []
        })
        
        setContentInput("");
    }

    function handleDrop(e, status) {
        let targetKey = e.dataTransfer.getData("key");
        updateObject(`todo/${targetKey}`, "status", status)
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
                                <TodoCard
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
            <NavMenu title="Todo" />
            <div id="pageContent">
                <form onSubmit={addContent} id="contentForm">
                    <input value={contentInput} onChange={field => setContentInput(field.target.value)} type="text" className="content_field" />
                    <button id="addContentButton" onClick={addContent}>Add Todo!</button>
                    <select onChange={field => setCardSizeView(field.target.value)} value={cardSizeView}>
                        <option>Default</option>
                        <option>Expanded</option>
                        <option>List</option>
                    </select>
                    <select onChange={field => setCardStatusView(field.target.value)} value={cardStatusView}>
                        <option>All</option>
                        <option>Planning</option>
                        <option>Todo</option>
                        <option>In Progress</option>
                        <option>Focus</option>
                        <option>Done</option>
                    </select>
                </form>
                <div className="cards_container">
                    { statusMatch("Todo", cardStatusView) && getStatusBlock("Todo") }
                    { statusMatch("In Progress", cardStatusView) && getStatusBlock("In Progress") }
                    { statusMatch("Done", cardStatusView) && getStatusBlock("Done") }
                </div>
            </div>
        </>
    );
};

const TodoCard = (props) => {
    const { ready, updateObject, removeObject } = useContext(DBContext);
    
    const card = props.card;
    const cardSizeView = props.cardSizeView;
    
    const [isEditing, setEditing] = useState(false);

    const [titleInput, setTitleInput] = useState(card.title || "");
    const [descriptionInput, setDescriptionInput] = useState(card.description || "");
    const [statusInput, setStatusInput] = useState(card.status || "Todo");
    const [checklistInput, setChecklistInput] = useState(card.checklist || []);
    const [dueDateInput, setDueDateInput] = useState(card.dueDate || "");

    const isDefault = (cardSizeView == "Default");

    const [draggedOver, setDraggedOver] = useState(false);
    const [dragging, setDragging] = useState(false);

    function updateContent() {
        updateObject(`todo/${card.key}`, "title", titleInput)
        updateObject(`todo/${card.key}`, "description", descriptionInput)
        updateObject(`todo/${card.key}`, "status", statusInput)
        updateObject(`todo/${card.key}`, "checklist", checklistInput)
        updateObject(`todo/${card.key}`, "dueDate", dueDateInput)
        
        setEditing(false);
    }

    function deleteCard() {
        if (confirm(`Delete \"${card.title}\"?`)) {
            removeObject(`todo/${card.key}`)
            setEditing(false);
        } else {
            console.log("Not deleting");
        }
    }

    function handleCheckBox(value, index) {
        let workingArray = [...checklistInput];
        workingArray[index].checked = value;
        setChecklistInput(workingArray);
    }

    function handleCheckBoxValue(value, index) {
        let workingArray = [...checklistInput];
        workingArray[index].value = value;
        setChecklistInput(workingArray);
    }

    function addChecklistItem() {
        let workingArray = [...checklistInput];
        workingArray.push({
            checked: false,
            value: ""
        });
        setChecklistInput(workingArray);
    }

    function generateChecklistContent() {
        if (checklistInput.length == 0) {
            return;
        }
        return <>{
            checklistInput.map((checklistObject, index) => (
                <div key={`${index}Container`}>
                    <input className="inline-input" type="checkbox" checked={checklistObject.checked} onChange={field => handleCheckBox(field.target.checked, index)} />
                    <input className="inline-input" type="text" value={checklistObject.value} onChange={field => handleCheckBoxValue(field.target.value, index)} />
                </div>
            ))}
        </>;

    }

    function generateDatePassed(dateToCheck) {
        let date = new Date(new Date(dateToCheck).toDateString()).getTime();
        let today = new Date(new Date().toDateString()).getTime();
        // console.log("Date: " + date + " today: " + today + "(" + (today - date) + ") ");
        if (date < today) {
            //Day is before today
            return "date-passed ";
        } else if (date == today) {
            //Day is today
            return "date-today ";
        } else {
            //Day is after today
            return "date-future ";
        }
    }

    function handleDrop(e) {
        let targetKey = e.dataTransfer.getData("key");

        updateObject(`todo/${targetKey}`, "status", card.status)

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
            { isEditing ?
                <>
                    <label htmlFor="contentTitleInput">Title</label>
                    <input id="contentTitleInput" className="margin-y-1" onChange={field => setTitleInput(field.target.value)} value={titleInput}></input>
                    <label htmlFor="contentDescriptionInput">Description</label>
                    <textarea id="contentDescriptionInput" className="margin-y-1" onChange={field => setDescriptionInput(field.target.value)} value={descriptionInput}></textarea>
                    {generateChecklistContent()}
                    <div id="formButtonContainer">
                        <button onClick={() => { addChecklistItem(); }}>Add Checklist item</button>
                    </div>
                    <StatusSelector value={statusInput} setValue={(value) => setStatusInput(value)} />
                    <label htmlFor="contentDueDateInput">Due Date</label>
                    <input id="contentDueDateInput" type="date" onChange={field => setDueDateInput(field.target.value)} value={dueDateInput}></input>
                    <div id="formButtonContainer">
                        <button onClick={updateContent}>Save</button>
                        <a id="deleteButton" onClick={deleteCard}>Delete</a>
                    </div>
                </> :
                <div className="cardContentContainer">
                    <div id="col1">
                        <h3>{card.title}</h3>
                        {!isDefault && <p>{description}</p>}
                    </div>
                    <div id="col2">
                        {card.dueDate && <p id="dueDateDisplay" className={generateDatePassed(card.dueDate)} >{ card.dueDate}</p>}
                    </div>
                </div>
            }
        </div >
    );
};


export default TodoPage;