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
import { Card } from './components/Card';
import { EditableChecklist } from './components/EditableChecklist';

const TodoPage = () => {
    const { ready, addDataListener, pushObject } = useContext(DBContext);

    const DEFAULT_STATUS_VIEW = "Planning";
    const DEFAULT_SIZE_VIEW = "Default";

    const [contentList, setContentList] = useState([]);
    const [contentInput, setContentInput] = useState("");
    const [cardSizeView, setCardSizeView] = useState(DEFAULT_SIZE_VIEW);
    const [cardStatusView, setCardStatusView] = useState(DEFAULT_STATUS_VIEW);

    const path = `todo`;

    useEffect(() => {
        if (ready) {
            addDataListener(path, setContentList);
        }
    }, [ready]);

    function addContent(event) {
        event.preventDefault();
        if (contentInput.length == 0) {
            return;
        }
        pushObject(path, {
            title: contentInput,
            description: "",
            status: "Todo",
            checklist: []
        });

        setContentInput("");
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
                    <StatusBlock status="Todo" path={path} sizeView={cardSizeView} statusView={cardStatusView} cards={contentList} />
                    <StatusBlock status="In Progress" path={path} sizeView={cardSizeView} statusView={cardStatusView} cards={contentList} />
                    <StatusBlock status="Done" path={path} sizeView={cardSizeView} statusView={cardStatusView} cards={contentList} />
                </div>
            </div>
        </>
    );
};

const TodoCard = (props) => {
    const { updateObject } = useContext(DBContext);

    const card = props.card;
    const sizeView = props.sizeView;

    const [titleInput, setTitleInput] = useState(card.title || "");
    const [descriptionInput, setDescriptionInput] = useState(card.description || "");
    const [statusInput, setStatusInput] = useState(card.status || "Todo");
    const [checklistInput, setChecklistInput] = useState(card.checklist || []);
    const [dueDateInput, setDueDateInput] = useState(card.dueDate || "");

    const isDefault = (sizeView == "Default");
    const path = props.path;
    const cardPath = `${path}/${card.key}`;

    function updateContent() {
        updateObject(cardPath, "title", titleInput);
        updateObject(cardPath, "description", descriptionInput);
        updateObject(cardPath, "status", statusInput);
        updateObject(cardPath, "checklist", checklistInput);
        updateObject(cardPath, "dueDate", dueDateInput);
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

    function dropHandler(path) {
        updateObject(path, "status", card.status);
    }

    return (
        <Card dropHandler={(targetKey) => dropHandler(`${path}/${targetKey}`)}
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
                    <EditableChecklist label={"Subtasks"} value={checklistInput} setValue={setChecklistInput} />
                    <StatusSelector value={statusInput} setValue={setStatusInput} />
                    <EditableInput label={"Due Date"} value={dueDateInput} setValue={setDueDateInput} type="date" />
                </>
            }
        />
    );
};

const StatusBlock = (props) => {
    const { updateObject } = useContext(DBContext);
    const status = props.status;
    const cards = props.cards;
    const statusView = props.statusView;
    const sizeView = props.sizeView;
    const path = props.path;

    function handleDrop(e, status) {
        let targetKey = e.dataTransfer.getData("key");
        updateObject(`${path}/${targetKey}`, "status", status);
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

    if (!statusMatch(status, statusView)) {
        return;
    }

    return (
        <div className='statusBlock'
            onDrop={(e) => { handleDrop(e, status); }}
            onDragOver={handleDragOver}>

            <h3>{status}</h3>
            {cards && cards.map(card => {
                if (statusMatch(card.status, status)) {
                    return (
                        <TodoCard
                            card={card}
                            path={path}
                            key={`${card.key}${card.title}`}
                            sizeView={sizeView}
                            statusView={statusView}
                        />
                    );
                }
            })
            }
        </div>
    );
};

export default TodoPage;