import { useContext, useState } from "react";
import { DBContext } from "../../contexts/DBContext";

export const Card = (props) => {
    const { removeObject } = useContext(DBContext);

    const [draggedOver, setDraggedOver] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [editing, setEditing] = useState(false);

    const dropHandler = props.dropHandler;
    const updateContent = props.updateContent;
    const resetContent = props.resetContent;

    const viewComponent = props.viewComponent;
    const editComponent = props.editComponent;

    const card = props.card;
    const cardClasses = props.cardClasses;
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
        if (updateContent) {
            updateContent();
        }
        setEditing(false);
    }

    function handleCancel() {
        if (resetContent) {
            resetContent();
        }
        setEditing(false);
    }

    function handleDrop(e) {
        let targetKey = e.dataTransfer.getData("key");
        if (dropHandler) {
            dropHandler(targetKey);
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
        classes += cardClasses;
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
                    {updateContent && <button onClick={handleSave}>Save</button>}
                    {resetContent && <button onClick={handleCancel}>Cancel</button>}
                    <a id="deleteButton" onClick={deleteCard}>Delete</a>
                </div>
            }

        </div>
    );
};