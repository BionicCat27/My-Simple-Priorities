//React
import React, { useEffect, useState, useContext } from 'react';
//Contexts
import { DBContext } from '../contexts/DBContext';
//Components
//Styles
import './common.css';
import NavMenu from './components/NavMenu/NavMenu';
import CardSizeViewSelector from './components/CardSizeViewSelector';
import { EditableInput } from './components/EditableInput';
import { EditableTextarea } from './components/EditableTextarea';
import { Card } from './components/Card';

const PrioritiesPage = (props) => {
    const { ready, addDataListener, pushObject } = useContext(DBContext);

    const DEFAULT_SIZE_VIEW = "Default";

    const [contentList, setContentList] = useState([]);
    const [contentInput, setContentInput] = useState("");
    const [cardSizeView, setCardSizeView] = useState(DEFAULT_SIZE_VIEW);

    useEffect(() => {
        if (ready) {
            addDataListener("priorities", setContentList);
        }
    }, [ready]);

    function addContent(event) {
        event.preventDefault();
        if (contentInput.length == 0) {
            return;
        }
        pushObject(`priorities`, {
            title: contentInput,
            description: "",
            hours: 0
        });
        setContentInput("");
    }

    function getTotalHours() {
        if (!contentList) return 0;
        return contentList.reduce((totalHours, card) => {
            if (!card.hours) return totalHours;
            return totalHours + parseInt(card.hours);
        }, 0);
    }

    return (
        <>
            <NavMenu title="Priorities" />
            <div id="pageContent">
                <form onSubmit={addContent} id="contentForm">
                    <input value={contentInput} onChange={field => setContentInput(field.target.value)} type="text" className="content_field" />
                    <button id="addContentButton" onClick={addContent}>Add priority!</button>
                    <CardSizeViewSelector setCardSizeView={setCardSizeView} cardSizeView={cardSizeView} />
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
    const { updateObject } = useContext(DBContext);

    const card = props.card;
    const cardSizeView = props.cardSizeView;

    const [titleInput, setTitleInput] = useState(card.title || "");
    const [descriptionInput, setDescriptionInput] = useState(card.description || "");
    const [hoursInput, setHoursInput] = useState(card.hours || 0);

    const cardPath = `priorities/${card.key}`;

    function updateContent() {
        updateObject(cardPath, "title", titleInput);
        updateObject(cardPath, "description", descriptionInput);
        updateObject(cardPath, "hours", hoursInput);
    }
    function resetContent() {
        setTitleInput(card.title);
        setDescriptionInput(card.description);
        setHoursInput(card.hours);
    }

    return (
        <Card card={card}
            updateContent={updateContent}
            resetContent={resetContent}
            cardPath={cardPath}
            viewComponent={
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
            editComponent={
                <>
                    <EditableInput label={"Title"} value={titleInput} setValue={setTitleInput} type="text" />
                    <EditableTextarea label={"Description"} value={descriptionInput} setValue={setDescriptionInput} />
                    <EditableInput label={"Hours"} value={hoursInput} setValue={setHoursInput} type="number" />
                </>
            } />
    );
};

export default PrioritiesPage;