import React, { useEffect, useState } from 'react';

import './priorityPage.css';

import '../firebaseConfig';

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, update, onValue } from "firebase/database";

//Components
import PageTitle from '../components/PageTitle';
import PriorityCard from "../components/PriorityCard";
import TodoCard from "../components/TodoCard";
import Sidebar from '../components/Sidebar';

const auth = getAuth();
const database = getDatabase();

const PriorityPage = () => {

    const DEFAULT_CONTENT_TYPE = "priorities";

    const [contentType, setContentType] = useState(DEFAULT_CONTENT_TYPE);
    const [contentList, setContentList] = useState([]);
    const [contentInput, setContentInput] = useState("");
    const [loggedInUser, setUser] = useState(undefined);
    const [renderedContent, setRenderedContent] = useState(null);
    const [contentTypeTitle, setContentTypeTitle] = useState(DEFAULT_CONTENT_TYPE);

    function onContentInputChange(value) {
        setContentInput(value);
    }

    useEffect(() => {
        setContentTypeTitle(contentType.charAt(0).toUpperCase() + contentType.slice(1));
        loadData();
    }, [contentType, loggedInUser]);

    useEffect(() => {
        if (contentList == null) return null;
        if (contentType == "priorities") {
            setRenderedContent(contentList.map((priority, index) => < PriorityCard title={priority.title} key={index + "" + priority.title} priorityIndex={index} movePriority={moveContent} deletePriority={deleteContent} updatePriority={updateContent} />));
        } else if (contentType == "todo") {
            setRenderedContent(contentList.map((todo, index) => < TodoCard title={todo.title} description={todo.description} key={index + "" + todo.title} todoIndex={index} moveTodo={moveContent} deleteTodo={deleteContent} updateTodo={updateContent} />));
        } else {
            setRenderedContent(null);
        }
        writeContent();
    }, [contentList]);

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
        }
    };

    function loadData() {
        if (!loggedInUser) {
            console.log("Can't load content - no user found.");
            return;
        }
        onValue(ref(database, `users/${loggedInUser.uid}/${contentType}`), (snapshot) => {
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
        }

        setContentList(concatList);
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
        <div id="contentPage">
            <PageTitle title={`My Simple ${contentTypeTitle}`} />
            <div id="pageContent" className="main-content div-card">
                <div id="contentTypeContainer">
                    <button className="content-type-button" onClick={() => { setContentType("priorities"); }}>Load priorities</button>
                    <button className="content-type-button" onClick={() => { setContentType("todo"); }}>Load todo</button>
                </div>
                <form onSubmit={addContent}>
                    <input value={contentInput} onChange={field => onContentInputChange(field.target.value)} type="text" id="contentField" />
                    <button id="addContentButton" onClick={addContent}>Add {contentType}!</button>
                </form>
                <div id="contentContainer">
                    {renderedContent}
                </div>
            </div>
            <Sidebar />
        </div >
    );
};

export default PriorityPage;