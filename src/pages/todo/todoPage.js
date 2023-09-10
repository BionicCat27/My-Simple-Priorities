//React
import React, { useEffect, useState, useContext } from 'react';
//Firebase
import { ref, update, onValue, off } from "firebase/database";
//Contexts
import { AuthContext } from "../../contexts/AuthContext";
import { DBContext } from '../../contexts/DBContext';
//Components
import NavMenu from '../../components/NavMenu/NavMenu';
import TodoCard from '../../components/TodoCard/TodoCard';
//Styles
import './todoPage.css';

const TodoPage = (props) => {
    const authContext = useContext(AuthContext);
    const { database } = useContext(DBContext);
    const user = authContext.user;

    const DEFAULT_STATUS_VIEW = "In Progress";
    const DEFAULT_SIZE_VIEW = "Default";

    const [contentList, setContentList] = useState([]);
    const [contentInput, setContentInput] = useState("");
    const [renderedContent, setRenderedContent] = useState(null);
    const [dbRef, setDbRef] = useState(undefined);
    const [cardSizeView, setCardSizeView] = useState(DEFAULT_SIZE_VIEW);
    const [cardStatusView, setCardStatusView] = useState(DEFAULT_STATUS_VIEW);

    function onContentInputChange(value) {
        setContentInput(value);
    }

    useEffect(() => {
        if (user) {
            if (dbRef) {
                off(dbRef);
            }
            setDbRef(ref(database, `users/${user.uid}/todo`));
            setRenderedContent(null);
            setContentList([]);
            setCardStatusView(DEFAULT_STATUS_VIEW);
        }
    }, [user]);

    useEffect(() => {
        generateCards();
    }, [contentList, cardSizeView, cardStatusView]);

    useEffect(() => {
        if (!dbRef) {
            console.log("Not logged in/no type");
            return;
        }
        if (!user) {
            console.log("Can't load content - no user found.");
            return;
        }
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data == null) {
                console.log("An error occurred.");
                setContentList([]);
                return;
            }
            //Validate card fields
            data.forEach((card, index) => {
                card.index = index;
                let needsSet = false;
                if (card.title == undefined) {
                    console.log("Title undefined");
                    card = { ...card, title: "" };
                    needsSet = true;
                }
                if (card.description == undefined) {
                    card = { ...card, description: "" };
                    needsSet = true;
                }
                if (card.status == undefined) {
                    card = { ...card, status: "" };
                    needsSet = true;
                }
                // if (card.checklist == undefined) {
                //     card = { ...card, checklist: [] };
                //     needsSet = true;
                // }
                //If a field was undefined, write the fully constructed object
                if (needsSet) {
                    console.log("Fixing undefined problem: " + JSON.stringify(card));
                    update(ref(database, 'users/' + user.uid + '/todo/' + index), {
                        ...card
                    });
                }
                return card;
            });
            setContentList(data);
        });
    }, [dbRef]);

    function generateCards() {
        if (!contentList) {
            setRenderedContent(null);
            return;
        }

        let workingCards = [...contentList];
        if (workingCards.length == 0) {
            return;
        }

        if (cardStatusView == "Planning") {
            let todoA = workingCards.filter(card => {
                if (!statusMatch(card.status, "Todo")) return null;
                return card;
            });
            let inprog = workingCards.filter(card => {
                if (!statusMatch(card.status, "In Progress")) return null;
                return card;
            });
            setRenderedContent(
                <>
                    <div id="leftHalf">
                        <h3>Todo</h3>
                        {todoA.map(card => generateCard(card))}
                    </div>
                    <div id="rightHalf">
                        <h3>In Progress</h3>
                        {inprog.map(card => generateCard(card))}
                    </div>
                </>
            );
        } else if (cardStatusView == "Focus") {
            let inprog = workingCards.filter(card => {
                if (!statusMatch(card.status, "In Progress")) return null;
                return card;
            });
            let done = workingCards.filter(card => {
                if (!statusMatch(card.status, "Done")) return null;
                return card;
            });
            setRenderedContent(
                <>
                    <div id="leftHalf">
                        <h3>In Progress</h3>
                        {inprog.map(card => generateCard(card))}
                    </div>
                    <div id="rightHalf">
                        <h3>Done</h3>
                        {done.map(card => generateCard(card))}
                    </div>
                </>
            );
        } else {
            workingCards = workingCards.filter(card => {
                if (!statusMatch(card.status, cardStatusView)) return null;
                return card;
            });
            setRenderedContent(workingCards.map(
                card => generateCard(card))
            );
        }
    }

    function generateCard(card) {
        return <TodoCard
            cardType="todo"
            title={card.title}
            description={card.description}
            progress={card.progress}
            status={card.status}
            checklist={card.checklist}
            dueDate={card.dueDate}
            key={`${card.index}${card.title}`}
            index={card.index}
            moveCard={moveContent}
            deleteCard={deleteContent}
            updateCard={updateContent}
            cardSizeView={cardSizeView}
            cardStatusView={cardStatusView}
            database={database}
            user={user}
        />;
    }

    function writeContent(content) {
        if (!user) {
            console.log("Can't write content - no user found: " + user);
            return;
        }
        update(ref(database, 'users/' + user.uid), {
            todo: content
        });
    };

    function addContent(event) {
        event.preventDefault();
        if (contentInput.length == 0) {
            return;
        }
        writeContent([{
            title: contentInput,
            description: "",
            status: "Todo",
            checklist: []
        }, ...contentList]);
        setContentInput("");
    }

    function moveContent(fromIndex, toIndex) {
        if (fromIndex < 0 || toIndex < 0 || fromIndex > contentList.length || toIndex > contentList.length) {
            console.log("An error occurred (" + fromIndex + " " + toIndex + " " + contentList + ")");
            return;
        }
        let workingList = contentList.slice();
        var element = workingList[fromIndex];
        workingList.splice(fromIndex, 1);
        workingList.splice(toIndex, 0, element);
        writeContent(workingList);
    }

    function deleteContent(index) {
        if (index < 0 || index > contentList.length) {
            console.log("An error occurred (" + index + " " + contentList + ")");
            return;
        }
        let workingList = contentList.slice();
        workingList.splice(index, 1);
        writeContent(workingList);
    }

    function updateContent(index, value) {
        if (index < 0 || index > contentList.length) {
            console.log("An error occurred (" + index + " " + contentList + ")");
        }
        let workingList = contentList.slice();
        workingList[index] = value;
        writeContent(workingList);
    }

    function statusMatch(status, targetstatus) {
        if (targetstatus === "All") return true;
        if (targetstatus === "Planning" && (status === "Todo" || status === "In Progress")) return true;
        if (targetstatus === "Focus" && (status === "In Progress" || status === "Done")) return true;
        if (targetstatus === status) return true;
        return false;
    }

    if (!user) return null;
    return (
        <>
            <NavMenu title="Todo" />
            <div id="pageContent">
                <form onSubmit={addContent} id="contentForm">
                    <input value={contentInput} onChange={field => onContentInputChange(field.target.value)} type="text" className="content_field" />
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
                    {renderedContent}
                </div>
            </div>
        </>
    );
};

export default TodoPage;