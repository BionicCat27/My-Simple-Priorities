//React
import React, { useEffect, useState, useContext } from 'react';
//Firebase
//Contexts
import { DBContext } from '../contexts/DBContext';
//Components
//Styles
import './common.css';
import NavMenu from './components/NavMenu/NavMenu';
import StatusSelector from './components/StatusSelector';
import CardSizeViewSelector from './components/CardSizeViewSelector';
import CardStatusViewSelector from './components/CardStatusViewSelector';
import { EditableInput } from './components/EditableInput';
import { EditableTextarea } from './components/EditableTextarea';

const TodoPage = (props) => {
    const { ready, addDataListener, pushObject, updateObject } = useContext(DBContext);

    const DEFAULT_STATUS_VIEW = "Planning";
    const DEFAULT_SIZE_VIEW = "Default";

    const [contentList, setContentList] = useState([]);
    const [contentInput, setContentInput] = useState("");
    const [cardSizeView, setCardSizeView] = useState(DEFAULT_SIZE_VIEW);
    const [cardStatusView, setCardStatusView] = useState(DEFAULT_STATUS_VIEW);

    useEffect(() => {
        if (ready) {
            addDataListener(`todo`, setContentList);
        }
    }, [ready]);

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
        });

        setContentInput("");
    }

    function handleDrop(e, status) {
        let targetKey = e.dataTransfer.getData("key");
        updateObject(`todo/${targetKey}`, "status", status);
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

const TodoCard = (props) => {
    const { updateObject } = useContext(DBContext);

    const card = props.card;
    const cardSizeView = props.cardSizeView;

    const [titleInput, setTitleInput] = useState(card.title || "");
    const [descriptionInput, setDescriptionInput] = useState(card.description || "");
    const [statusInput, setStatusInput] = useState(card.status || "Todo");
    const [checklistInput, setChecklistInput] = useState(card.checklist || []);
    const [dueDateInput, setDueDateInput] = useState(card.dueDate || "");

    const isDefault = (cardSizeView == "Default");
    const cardPath = `todo/${card.key}`;

    function updateContent() {
        updateObject(cardPath, "title", titleInput);
        updateObject(cardPath, "description", descriptionInput);
        updateObject(cardPath, "status", statusInput);
        updateObject(cardPath, "checklist", checklistInput);
        updateObject(cardPath, "dueDate", dueDateInput);
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

    function generateDatePassed(dateToCheck) {
        let date = new Date(new Date(dateToCheck).toDateString()).getTime();
        let today = new Date(new Date().toDateString()).getTime();
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

    function dropHandler(targetKey) {
        updateObject(`todo/${targetKey}`, "status", card.status);
    }

    return (
        <Card dropHandler={dropHandler}
            isDefault={isDefault}
            updateContent={updateContent}
            cardPath={cardPath}
            card={card}
            viewComponent={
                <div className="cardContentContainer">
                    <div id="col1">
                        <h3>{card.title}</h3>
                        {!isDefault && <p>{card.description}</p>}
                    </div>
                    <div id="col2">
                        {card.dueDate && <p id="dueDateDisplay" className={generateDatePassed(card.dueDate)} >{card.dueDate}</p>}
                    </div>
                </div>
            }
            editComponent={
                <>
                    <EditableInput label={"Title"} value={titleInput} setValue={setTitleInput} type="text" />
                    <EditableTextarea label={"Description"} value={descriptionInput} setValue={setDescriptionInput} />
                    <label>Checklist</label>
                    {
                        checklistInput && checklistInput.map((checklistObject, index) => (
                            <div key={`${index}Container`}>
                                <input className="inline-input" type="checkbox" checked={checklistObject.checked} onChange={field => handleCheckBox(field.target.checked, index)} />
                                <input className="inline-input" type="text" value={checklistObject.value} onChange={field => handleCheckBoxValue(field.target.value, index)} />
                            </div>
                        ))
                    }
                    <div id="formButtonContainer">
                        <button onClick={() => { addChecklistItem(); }}>Add Checklist item</button>
                    </div>
                    <StatusSelector value={statusInput} setValue={(value) => setStatusInput(value)} />
                    <EditableInput label={"Due Date"} value={dueDateInput} setValue={setDueDateInput} type="date" />
                </>
            }
        />
    );
};

const Card = (props) => {
    const { removeObject } = useContext(DBContext);

    const [draggedOver, setDraggedOver] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [editing, setEditing] = useState(false);

    const dropHandler = props.dropHandler;
    const updateContent = props.updateContent;

    const viewComponent = props.viewComponent;
    const editComponent = props.editComponent;

    const card = props.card;
    const cardPath = props.cardPath;
    if (!card) return;
    const isDefault = props.isDefault || true;

    function deleteCard() {
        if (confirm(`Delete \"${card.title}\"?`)) {
            removeObject(cardPath);
            setEditing(false);
        } else {
            console.log("Not deleting");
        }
    }

    function handleSave() {
        updateContent();
        setEditing(false);
    }

    function handleDrop(e) {
        let targetKey = e.dataTransfer.getData("key");
        dropHandler(targetKey);
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

    function generateClasses() {
        let classes = (isDefault ? "condensed_card " : "content_card ");
        classes += (dragging ? "brdr-red " : " ");
        classes += (draggedOver ? "brdr-blue " : " ");
        return classes;
    }
    return (
        <div draggable className={generateClasses()}
            onClick={() => (!editing && setEditing(true))}
            onDrop={(e) => { handleDrop(e); }}
            onDragStart={(e) => { handleDragStart(e, card.key, card.status); }}
            onDragEnd={(e) => { handleDragEnd(e); }}
            onDragOver={(e) => { handleDragOver(e); }}
            onDragLeave={(e) => { handleDragLeave(e); }}
            onTouchMove={(e) => { handleDragStart(e, card.key, card.status); }}
            onTouchEnd={(e) => { handleDragEnd(e); }}>
            {editing
                ? editComponent
                : viewComponent
            }
            {editing &&
                <div id="formButtonContainer">
                    <button onClick={handleSave}>Save</button>
                    <a id="deleteButton" onClick={deleteCard}>Delete</a>
                </div>
            }

        </div>
    );
};

export default TodoPage;