import React, { useEffect, useState } from 'react';

import '../firebaseConfig';

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";

//Components
import PageTitle from '../components/PageTitle';
import Description from '../components/Description';
import Footer from '../components/Footer';
import PriorityCard from "../components/PriorityCard";

const auth = getAuth();
const database = getDatabase();

const PriorityPage = () => {
    const [priorityList, setPriorityList] = useState([]);
    const [priorityInput, setPriorityInput] = useState("");
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        onAuthStateChanged(auth, (userResult) => {
            if (userResult) {
                console.log("User found");
                setUser(userResult);
                onValue(ref(database, 'users/' + userResult.uid + '/priorities'), (snapshot) => {
                    const data = snapshot.val();
                    if (data == null) {
                        console.log("An error occurred.");
                        return;
                    }
                    console.log("Loaded prio data: " + data);
                    setPriorityList(data);
                });
            } else {
                console.log("User not found");
                setUser(undefined);
                window.location = "/login";
            }
        });
    }, [auth]);

    function writePriorities(list_of_priorities) {
        console.log("Writing! " + priorityList);
        set(ref(database, 'users/' + user.uid), {
            priorities: list_of_priorities
        });
        console.log("Wrote!");
        onValue(ref(database, 'users/' + user.uid + '/priorities'), (snapshot) => {
            const data = snapshot.val();
            console.log("Read: " + data + " " + list_of_priorities);
        });
    }

    function userSignOut() {
        signOut(auth).then(() => {
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
        writePriorities(concatList);
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
        writePriorities(workingList);
    }

    function deletePriority(index) {
        if (index < 0 || index > priorityList.length) {
            console.log("An error occurred (" + index + " " + priorityList + ")");
            return;
        }
        let workingList = priorityList.slice();
        workingList.splice(index, 1);
        setPriorityList(workingList);
        writePriorities(workingList);
    }

    function updatePriority(index, value) {
        let workingList = priorityList.slice();
        workingList[index] = value;
        setPriorityList(workingList);
        writePriorities(workingList);
    }

    console.log("Rendering");

    if (user) {
        return (
            <div className="main-content">
                <PageTitle title="My Simple Priorities" />
                <div id="PriorityContent" className="div-card">
                    <p>My Priorities</p>
                    <button onClick={() => { userSignOut(); }} >Sign Out</button>
                    <input value={priorityInput} onChange={field => onPriorityInputChange(field.target.value)} type="text" id="priority_field" />
                    <button id="PriorityButton" onClick={() => addPriority()}>Add priority!</button>
                    {
                        priorityList.map((priorityTitle, index) => <PriorityCard title={priorityTitle} key={index} priorityIndex={index} movePriority={movePriority} deletePriority={deletePriority} updatePriority={updatePriority} />)
                    }
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