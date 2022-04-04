import React, { useEffect, useState } from 'react';

import './contentPage.css';

import '../firebaseConfig';

import { getAuth, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";
import { getDatabase, ref, update, onValue, off, connectDatabaseEmulator } from "firebase/database";

//Components
import ContentCard from "../components/ContentCard";
import Sidebar from '../components/Sidebar';

const auth = getAuth();
const database = getDatabase();

if (location.hostname === "localhost" && location.port === "5001") {
    connectDatabaseEmulator(database, "localhost", 9000);
    connectAuthEmulator(auth, "http://localhost:9099");
}

const ContentPage = (props) => {

    const DEFAULT_CONTENT_TYPE = props.contentType;
    const DEFAULT_STATUS_VIEW = "In Progress";
    const DEFAULT_SIZE_VIEW = "Default";

    const [contentType, setContentType] = useState(DEFAULT_CONTENT_TYPE);
    const [contentList, setContentList] = useState([]);
    const [contentInput, setContentInput] = useState("");
    const [loggedInUser, setUser] = useState(undefined);
    const [renderedContent, setRenderedContent] = useState(null);
    const [contentTypeTitle, setContentTypeTitle] = useState(DEFAULT_CONTENT_TYPE);
    const [dbRef, setDbRef] = useState(undefined);
    const [cardSizeView, setCardSizeView] = useState(DEFAULT_SIZE_VIEW);
    const [cardStatusView, setCardStatusView] = useState(DEFAULT_STATUS_VIEW);

    function onContentInputChange(value) {
        setContentInput(value);
    }

    useEffect(() => {
        if (loggedInUser && contentType) {
            if (dbRef) {
                off(dbRef);
            }
            setDbRef(ref(database, `users/${loggedInUser.uid}/${contentType}`));
            setRenderedContent(null);
            setContentList([]);
            setCardStatusView(DEFAULT_STATUS_VIEW);
        }
        setContentTypeTitle(contentType.charAt(0).toUpperCase() + contentType.slice(1));
    }, [contentType, loggedInUser]);

    useEffect(() => {
        generateCards();
    }, [contentList, cardSizeView, cardStatusView]);

    useEffect(() => {
        if (!dbRef) {
            console.log("Not logged in/no type");
            return;
        }
        if (!loggedInUser) {
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
            console.log("Surely we can iterate here?? " + data);
            let filtering = data.forEach((card, index) => {
                console.log(card + " " + index);
                card.index = index;
                console.log("Index: " + card.index);
                return card;
            });
            console.log("Filtering: " + filtering);
            setContentList(data);
        });
    }, [dbRef]);

    function generateCards() {
        console.log(contentList + " " + contentType);
        if (!contentType || !contentList) {
            setRenderedContent(null);
            return;
        }

        let workingCards = [...contentList];
        if (workingCards.length == 0) {
            return;
        }

        if (contentType === "todo" || contentType === "review") {
            workingCards = workingCards.filter(card => {
                if (!statusMatch(card.status, cardStatusView)) return null;
                return card;
            });
        }

        console.log("Is this where we can't iterate from?");
        setRenderedContent(workingCards.map(
            (card, index) =>
                <ContentCard
                    cardType={contentType}
                    title={card.title}
                    description={card.description}
                    progress={card.progress}
                    status={card.status}
                    key={`${card.index}${card.title}`}
                    index={card.index}
                    moveCard={moveContent}
                    deleteCard={deleteContent}
                    updateCard={updateContent}
                    cardSizeView={cardSizeView}
                    cardStatusView={cardStatusView}
                    database={database}
                    user={loggedInUser}
                />)
        );
    }

    useEffect(() => {
        onAuthStateChanged(auth, (userResult) => {
            if (userResult) {
                setUser(userResult);
                console.log("Logged in");
            } else {
                console.log("Not logged in");
                setUser(undefined);
                window.location = "/login";
            }
        });
    }, [auth]);

    function writeContent(content) {
        if (!loggedInUser) {
            console.log("Can't write content - no user found: " + loggedInUser);
            return;
        }
        update(ref(database, 'users/' + loggedInUser.uid), {
            [contentType]: content
        });
    };

    function addContent(event) {
        event.preventDefault();
        if (contentInput.length == 0) {
            return;
        }
        if (contentType == "priorities") {
            writeContent([{
                title: contentInput,
                description: ""
            }, ...contentList]);
        } else if (contentType == "todo") {
            writeContent([{
                title: contentInput,
                description: "",
                status: "Todo"
            }, ...contentList]);
        } else if (contentType == "review") {
            writeContent([{
                title: contentInput,
                description: "",
                progress: [],
                status: "Todo"
            }, ...contentList]);
        }
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
        console.log(status + " " + targetstatus);
        if (targetstatus === "All") return true;
        if (targetstatus === "Planning" && (status === "Todo" || status === "In Progress")) return true;
        if (targetstatus === status) return true;
        return false;
    }

    if (!loggedInUser) return null;
    return (
        <>
            <div id="pageContent">
                <form onSubmit={addContent} id="contentForm">
                    <input value={contentInput} onChange={field => onContentInputChange(field.target.value)} type="text" className="content_field" />
                    <button id="addContentButton" onClick={addContent}>Add {contentType}!</button>
                    <select onChange={field => setCardSizeView(field.target.value)} value={cardSizeView}>
                        <option>Default</option>
                        <option>Expanded</option>
                        <option>List</option>
                    </select>
                    {(contentType == "todo" || contentType == "review") &&
                        <select onChange={field => setCardStatusView(field.target.value)} value={cardStatusView}>
                            <option>All</option>
                            <option>Planning</option>
                            <option>Todo</option>
                            <option>In Progress</option>
                            <option>Done</option>
                        </select>
                    }
                </form>
                <div className="cards_container">
                    {renderedContent}
                </div>
            </div>
            <Sidebar title={contentTypeTitle} setContentType={setContentType} />
        </>
    );
};

export default ContentPage;