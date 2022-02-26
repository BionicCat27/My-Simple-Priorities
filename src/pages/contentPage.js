import React, { useEffect, useState } from 'react';

import './contentPage.css';

import '../firebaseConfig';

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, update, onValue, off } from "firebase/database";

//Components
import ContentCard from "../components/ContentCard";
import Sidebar from '../components/Sidebar';

const auth = getAuth();
const database = getDatabase();

const ContentPage = (props) => {

    const DEFAULT_CONTENT_TYPE = props.contentType;

    const [contentType, setContentType] = useState(DEFAULT_CONTENT_TYPE);
    const [contentList, setContentList] = useState([]);
    const [contentInput, setContentInput] = useState("");
    const [loggedInUser, setUser] = useState(undefined);
    const [renderedContent, setRenderedContent] = useState(null);
    const [contentTypeTitle, setContentTypeTitle] = useState(DEFAULT_CONTENT_TYPE);
    const [dbRef, setDbRef] = useState(undefined);
    const [cardView, setCardView] = useState("default");

    function onContentInputChange(value) {
        setContentInput(value);
    }

    useEffect(() => {
        if (loggedInUser && contentType) {
            if (dbRef) {
                off(dbRef);
            }
            setDbRef(ref(database, `users/${loggedInUser.uid}/${contentType}`));
        }
        setContentTypeTitle(contentType.charAt(0).toUpperCase() + contentType.slice(1));
    }, [contentType, loggedInUser]);

    useEffect(() => {
        loadData();
    }, [dbRef]);

    useEffect(() => {
        generateCards();
    }, [cardView]);

    useEffect(() => {
        generateCards();
        writeContent();
    }, [contentList]);

    function generateCards() {
        if (contentList == null) return null;
        if (contentType == "priorities") {
            setRenderedContent(contentList.map((priority, index) => < ContentCard cardType={"priority"} title={priority.title} description={priority.description} key={index + "" + priority.title} index={index} moveCard={moveContent} deleteCard={deleteContent} updateCard={updateContent} cardView={cardView} />));
        } else if (contentType == "todo") {
            setRenderedContent(contentList.map((todo, index) => < ContentCard cardType={"todo"} title={todo.title} description={todo.description} key={index + "" + todo.title} index={index} moveCard={moveContent} deleteCard={deleteContent} updateCard={updateContent} cardView={cardView} />));
        } else if (contentType == "review") {
            setRenderedContent(contentList.map((review, index) => < ContentCard cardType={"review"} title={review.title} description={review.description} progress={review.progress} key={index + "" + review.title} index={index} moveCard={moveContent} deleteCard={deleteContent} updateCard={updateContent} cardView={cardView} />));
        } else {
            setRenderedContent(null);
        }
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

    function writeContent() {
        if (!loggedInUser) {
            console.log("Can't write content - no user found: " + loggedInUser);
            return;
        }
        if (contentType == "priorities") {
            update(ref(database, 'users/' + loggedInUser.uid), {
                priorities: contentList
            });
        } else if (contentType == "todo") {
            update(ref(database, 'users/' + loggedInUser.uid), {
                todo: contentList
            });
        } else if (contentType == "review") {
            update(ref(database, 'users/' + loggedInUser.uid), {
                review: contentList
            });
        }
    };

    function loadData() {
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
            setContentList(data);
        });
    }

    function addContent(event) {
        event.preventDefault();
        if (contentInput.length == 0) {
            return;
        }
        let concatList;
        if (contentType == "priorities") {
            concatList = [{
                title: contentInput,
                description: ""
            }].concat(contentList);
        } else if (contentType == "todo") {
            concatList = [{
                title: contentInput,
                description: ""
            }].concat(contentList);
        } else if (contentType == "review") {
            concatList = [{
                title: contentInput,
                description: "",
                progress: []
            }].concat(contentList);
        }

        setContentList(concatList);
        setContentInput("");
    }

    function toggleCondensedView() {
        if (cardView == "default") {
            setCardView("condensed");
        } else {
            setCardView("default");
        }
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
        setContentList(workingList);
    }

    function deleteContent(index) {
        if (index < 0 || index > contentList.length) {
            console.log("An error occurred (" + index + " " + contentList + ")");
            return;
        }
        let workingList = contentList.slice();
        workingList.splice(index, 1);
        setContentList(workingList);
    }

    function updateContent(index, value) {
        if (index < 0 || index > contentList.length) {
            console.log("An error occurred (" + index + " " + contentList + ")");
        }
        let workingList = contentList.slice();
        workingList[index] = value;
        setContentList(workingList);
    }

    if (!loggedInUser) return null;
    return (
        <>
            <div id="pageContent">
                <form onSubmit={addContent} id="contentForm">
                    <input value={contentInput} onChange={field => onContentInputChange(field.target.value)} type="text" className="content_field" />
                    <button id="addContentButton" onClick={addContent}>Add {contentType}!</button>
                    <button id="toggleCondensedView" onClick={toggleCondensedView}>Toggle View</button>
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