import React from 'react';

import './Sidebar.css';

import '../firebaseConfig';

import { getAuth, signOut, connectAuthEmulator } from "firebase/auth";

const auth = getAuth();
if (location.hostname === "localhost" && location.port === "5001") {
    connectAuthEmulator(auth, "http://localhost:9099");
}

const Sidebar = (props) => {

    function userSignOut() {
        signOut(auth).then(() => {
            window.location = " /login";
        }).catch((error) => {
            console.log("An error occurred during signout: " + error);
        });
    }

    return (
        <div id="sidebar">
            <div id="sidebarLinksContainer">
                <h2 id="sidebarTitle">My Simple<br />{props.title}</h2>
                <a href="/priorities">Priorities</a>
                <a href="/todo">Todo</a>
                <a href="/review">Review</a>
                <a onClick={userSignOut}>Logout</a>
            </div>
            <div id="sidebarCreditContainer">
                <a href="https://aslanbb.vercel.app/">Aslan Bennington-Barr</a>
                <br />
                <a href="https://github.com/BionicCat27">
                    <img id="githubLogo" src="/resources/GitHub_Logo.png" />
                </a>
                <a href="https://www.linkedin.com/in/aslan-bennington-barr/">
                    <img id="linkedinLogo" src="/resources/LI-Logo.png" />
                </a>
            </div>
        </div >
    );
};

export default Sidebar;