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

    const [contentType, setContentType] = useState("priorities");
    const [contentList, setContentList] = useState([]);
    const [contentInput, setContentInput] = useState("");
    const [user, setUser] = useState(undefined);

    const renderedContent = generateRenderedContent(contentType);

    const contentTypeTitle = contentType.charAt(0).toUpperCase() + contentType.slice(1);

    function generateRenderedContent(newType) {
        if (newType == "priorities") {
            return contentList.map((priorityTitle, index) => < PriorityCard title={priorityTitle} key={index + "" + priorityTitle} priorityIndex={index} movePriority={moveContent} deletePriority={deleteContent} updatePriority={updateContent} />);
        } else if (newType == "todo") {
            return contentList.map((todo, index) => < TodoCard title={todo.title} description={todo.description} key={index + "" + todo.title} todoIndex={index} moveTodo={moveContent} deleteTodo={deleteContent} updateTodo={updateContent} />);
        } else {
            return null;
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, (userResult) => {
            if (userResult) {
                setUser(userResult);
                loadData(userResult, contentType);
            } else {
                setUser(undefined);
                window.location = "/login";
            }
        });
    }, [auth]);

    function loadData(inputUser, inputContentType) {
        onValue(ref(database, `users/${inputUser.uid}/${inputContentType}`), (snapshot) => {
            const data = snapshot.val();
            if (data == null) {
                console.log("An error occurred.");
                setContentList([]);
                return;
            }
            setContentList(data);
        });
    }

    function changeContentType(newType) {
        setContentType(newType);
        loadData(user, newType);
    }

    function writeContent(list_of_content) {
        if (contentType == "priorities") {
            update(ref(database, 'users/' + user.uid), {
                priorities: list_of_content
            });
        } else if (contentType == "todo") {
            update(ref(database, 'users/' + user.uid), {
                todo: list_of_content
            });
        }
    };

    function addContent(event) {
        event.preventDefault();
        if (contentInput.length == 0) {
            return;
        }
        let concatList;
        if (contentType == "priorities") {
            concatList = [contentInput].concat(contentList);
        } else if (contentType == "todo") {
            concatList = [{
                title: contentInput,
                description: ""
            }].concat(contentList);
        }

        setContentList(concatList);
        setContentInput("");
        writeContent(concatList);
    }

    function onContentInputChange(value) {
        setContentInput(value);
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
        writeContent(workingList);
    }

    function deleteContent(index) {
        if (index < 0 || index > contentList.length) {
            console.log("An error occurred (" + index + " " + contentList + ")");
            return;
        }
        let workingList = contentList.slice();
        workingList.splice(index, 1);
        setContentList(workingList);
        writeContent(workingList);
    }

    function updateContent(index, value) {
        let workingList = contentList.slice();
        workingList[index] = value;
        setContentList(workingList);
        writeContent(workingList);
    }

    if (!user) return null;
    return (
        <div id="contentPage">
            <PageTitle title={`My Simple ${contentTypeTitle}`} />
            <div id="pageContent" className="main-content div-card">
                <button onClick={() => { changeContentType("priorities"); }}>Load priorities</button>
                <button onClick={() => { changeContentType("todo"); }}>Load todo</button>
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