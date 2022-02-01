import React, { useState } from 'react';

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

//Components
import PageTitle from '../components/PageTitle';
import Priorities from '../components/Priorities';
import Description from '../components/Description';
import Footer from '../components/Footer';

const PriorityPage = () => {
    const [priorityList, setPriorityList] = useState([]);
    const [priorityInput, setPriorityInput] = useState("");
    const [user, setUser] = useState(undefined);

    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
        } else {
            setUser(undefined);
            window.location = "/login";
        }
    });

    function userSignOut() {
        signOut(auth).then(() => {
            setUser(undefined);
            window.location = " /login";
        }).catch((error) => {
            console.log("An error occurred during signout: " + error);
        });
    }

    function addPriority() {
        if (priorityInput.length == 0) {
            return;
        }
        let concatList = [priorityInput].concat(priorityList);
        setPriorityList(concatList);
        setPriorityInput("");

    }

    function onPriorityInputChange(value) {
        setPriorityInput(value);
    }

    function movePriority(fromIndex, toIndex) {
        console.log("moving priority");
        if (fromIndex < 0 || toIndex < 0 || fromIndex > priorityList.length || toIndex > priorityList.length) {
            console.log("An error occurred (" + fromIndex + " " + toIndex + " " + priorityList + ")");
            return;
        }
        let workingList = priorityList.slice();
        var element = workingList[fromIndex];
        workingList.splice(fromIndex, 1);
        workingList.splice(toIndex, 0, element);
        setPriorityList(workingList);
    }

    function deletePriority(index) {
        if (index < 0 || index > priorityList.length) {
            console.log("An error occurred (" + index + " " + priorityList + ")");
            return;
        }
        let workingList = priorityList.slice();
        workingList.splice(index, 1);
        setPriorityList(workingList);
    }

    function updatePriority(index, value) {
        let workingList = priorityList.slice();
        workingList[index] = value;
        setPriorityList(workingList);
    }

    if (user) {
        return (
            <div className="main-content">
                <PageTitle title="My Simple Priorities" />
                <div id="PriorityContent" className="div-card">
                    <p>My Priorities</p>
                    <button onClick={() => { userSignOut(); }} >Sign Out</button>
                    <input value={priorityInput} onChange={field => onPriorityInputChange(field.target.value)} type="text" id="priority_field" />
                    <button id="PriorityButton" onClick={() => addPriority()}>Add priority!</button>
                    <Priorities priorityList={priorityList} key={priorityList} movePriority={movePriority} deletePriority={deletePriority} updatePriority={updatePriority} />
                </div>
                <Description />
                <Footer />
            </div >
        );
    } else {
        return null;
    }


};

export default PriorityPage;