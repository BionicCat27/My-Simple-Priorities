import React, { useEffect, useState } from 'react';

import './timelinePage.css';

import '../../firebaseConfig';

import { getAuth, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";
import { getDatabase, ref, update, onValue, off, connectDatabaseEmulator } from "firebase/database";

//Components
import ContentCard from "../../components/ContentCard";
import Sidebar from '../../components/Sidebar';

const auth = getAuth();
const database = getDatabase();

if (location.hostname === "localhost" && location.port === "5001") {
    connectDatabaseEmulator(database, "localhost", 9000);
    connectAuthEmulator(auth, "http://localhost:9099");
}

const TimelinePage = (props) => {
    const defaultToday = new Date();
    const todayDateString = dateToYMD(defaultToday);
    const defaultTomorrow = new Date().setDate(new Date().getDate() + 1);
    const tomorrowDateString = dateToYMD(defaultTomorrow);

    const [loggedInUser, setUser] = useState(undefined);
    const [dbRef, setDbRef] = useState(undefined);

    const [contentList, setContentList] = useState([]);

    const [contentInput, setContentInput] = useState("");
    const [startDateInput, setStartDateInput] = useState(todayDateString);
    const [endDateInput, setEndDateInput] = useState(tomorrowDateString);

    const [renderedContent, setRenderedContent] = useState(null);

    useEffect(() => {
        if (loggedInUser) {
            if (dbRef) {
                off(dbRef);
            }
            setDbRef(ref(database, `users/${loggedInUser.uid}/timeline`));
        }
    }, [loggedInUser]);

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
            setContentList(data);
        });
    }, [dbRef]);

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

    useEffect(() => {
        generateLines();
    }, [contentList]);

    function generateLines() {
        if (!contentList) {
            setRenderedContent(null);
            return;
        }

        let workingCards = [...contentList];
        if (workingCards.length == 0) {
            return;
        }

        setRenderedContent(
            <>
                {workingCards.map((line, index) =>
                    <p key={`${index}${line.title}`}>
                        Line No. {index}: {line.title}
                    </p>
                )}
            </>
        );
    }

    function dateToYMD(date) {
        date = new Date(date);
        return date.getFullYear() + "-" + (date.getMonth() >= 10 ? date.getMonth() : "0" + date.getMonth()) + "-" + (date.getDate() >= 10 ? date.getDate() : "0" + date.getDate());
    }

    function onContentInputChange(value) {
        setContentInput(value);
    }

    function onStartDateInputChange(value) {
        setStartDateInput(value);
    }

    function onEndDateInputChange(value) {
        setEndDateInput(value);
    }

    function writeContent(content) {
        if (!loggedInUser) {
            console.log("Can't write content - no user found: " + loggedInUser);
            return;
        }
        update(ref(database, 'users/' + loggedInUser.uid), {
            timeline: content
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
            dates: [{ startDate: startDateInput, endDate: endDateInput }]
        }, ...contentList]);
        setContentInput("");
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

    if (!loggedInUser) return null;
    return (
        <>
            <div id="pageContent">
                <form onSubmit={addContent} id="contentForm">
                    <input value={contentInput} onChange={field => onContentInputChange(field.target.value)} type="text" className="content_field" />
                    <input value={startDateInput} onChange={field => onStartDateInputChange(field.target.value)} type="date" className="content_field" />
                    <input value={endDateInput} onChange={field => onEndDateInputChange(field.target.value)} type="date" className="content_field" />
                    <button id="addContentButton" onClick={addContent}>Add Line!</button>
                </form>
                <div className="cards_container">
                    {renderedContent}
                </div>
            </div>
            <Sidebar title={"Timeline"} />
        </>
    );
};

export default TimelinePage;