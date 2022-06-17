import React, { useEffect, useState } from "react";
import { ref, update, getDatabase } from "firebase/database";

import './TodoCard.css';

const TodoCard = (props) => {
    const [isEditing, setEditing] = useState(false);
    const cardSizeView = props.cardSizeView;

    const [title, setTitle] = useState(props.title || "");
    const [description, setDescription] = useState(props.description || "");
    const [status, setStatus] = useState(props.status || "Todo");
    const [checklist, setChecklist] = useState(props.checklist || []);
    const [dueDate, setDueDate] = useState(props.dueDate || "");

    const [titleInput, setTitleInput] = useState(title);
    const [descriptionInput, setDescriptionInput] = useState(description);
    const [statusInput, setStatusInput] = useState(status);
    const [checklistInput, setChecklistInput] = useState(checklist);
    const [dueDateInput, setDueDateInput] = useState(dueDate);

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

    useEffect(() => {
        if (props.user) {
            let result = update(ref(props.database, 'users/' + props.user.uid + '/todo/' + props.index), {
                checklist: checklist
            });
            return;
        }
        console.log("Bad user!");
    }, [checklist]);

    useEffect(() => {
        if (props.user) {
            let result = update(ref(props.database, 'users/' + props.user.uid + '/todo/' + props.index), {
                dueDate: dueDate
            });
            return;
        }
        console.log("Bad user!");
    }, [dueDate]);

    function updateContent() {
        setTitle(titleInput);
        setDescription(descriptionInput);
        setStatus(statusInput);
        setChecklist(checklistInput);
        setDueDate(dueDateInput);
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

    function generateCardContent() {
        let todoSelected = (statusInput == "Todo" ? "btn-active": "");
        let inprogSelected = (statusInput == "In Progress" ? "btn-active": "");
        let doneSelected = (statusInput == "Done" ? "btn-active": "");

        if (isEditing) {
            return (<>
                <label htmlFor="contentTitleInput">Title</label>
                <input id="contentTitleInput" className="margin-y-1" onChange={field => setTitleInput(field.target.value)} value={titleInput}></input>
                <label htmlFor="contentDescriptionInput">Description</label>
                <textarea id="contentDescriptionInput" className="margin-y-1" onChange={field => setDescriptionInput(field.target.value)} value={descriptionInput}></textarea>
                {generateChecklistContent()}
                <div id="formButtonContainer">
                    <button onClick={() => { addChecklistItem(); }}>Add Checklist item</button>
                </div>
                <div id="formButtonContainer">
                    <button onClick={() => { setStatusInput("Todo"); }} className={todoSelected}>Todo</button>
                    <button onClick={() => { setStatusInput("In Progress"); }} className={inprogSelected}>In Progress</button>
                    <button onClick={() => { setStatusInput("Done"); }} className={doneSelected}>Done</button>
                </div>
                <label htmlFor="contentDueDateInput">Due Date</label>
                <input id="contentDueDateInput" type="date" onChange={field => setDueDateInput(field.target.value)} value={dueDateInput}></input>
                <div id="formButtonContainer">
                    <button onClick={updateContent}>Save</button>
                    <a id="deleteButton" onClick={deleteCard}>Delete</a>
                </div>
            </>);
        } else {
            return (<div className="cardContentContainer">
                <div id="col1">
                    <h3>{title}</h3>
                    {!isDefault && <p>{description}</p>}
                </div>
                <div id="col2">
                    {dueDate && <p id="dueDateDisplay">{dueDate}</p>}
                </div>
            </div>);
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

    function addChecklistItem() {
        let workingArray = [...checklistInput];
        workingArray.push({
            checked: false,
            value: ""
        });
        setChecklistInput(workingArray);
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