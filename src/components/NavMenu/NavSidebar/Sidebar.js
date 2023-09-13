import React from 'react';

import './Sidebar.css';

import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const auth = getAuth();

const Sidebar = (props) => {

    const navigate = useNavigate();

    function userSignOut() {
        signOut(auth).then(() => {
            window.location = "/login";
        }).catch((error) => {
            console.log("An error occurred during signout: " + error);
        });
    }

    function generateSidebarLinks() {
        return <>
            <a className={"nav-button"} onClick={() => navigate("/capture")}>Capture</a>
            <a className={"nav-button"} onClick={() => navigate("/priorities")}>Priorities</a>
            <a className={"nav-button"} onClick={() => navigate("/todo")}>Todo</a>
            <a className={"nav-button"} onClick={() => navigate("/review")}>Review</a>
            <a className={"nav-button"} onClick={() => navigate("/timeline")}>Timeline</a>
        </>;
    }

    let sidebarLinks = generateSidebarLinks();
    return (
        <div id="sidebar">
            <div id="sidebarLinksContainer">
                <h2 id="sidebarTitle">My Simple<br />{props.title}</h2>
                {sidebarLinks}
                <a className={"nav-button"} onClick={userSignOut}>Logout</a>
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