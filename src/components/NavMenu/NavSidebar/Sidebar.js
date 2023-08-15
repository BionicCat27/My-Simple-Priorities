import React, { useContext } from 'react';

import './Sidebar.css';

import '../../../firebaseConfig';

import { getAuth, signOut, connectAuthEmulator } from "firebase/auth";
import { ViewsContext } from '../../../contexts/ViewsContext';
import { NavigationContext } from '../../../contexts/NavigationContext';

const auth = getAuth();
if (location.hostname === "localhost" && location.port === "5001") {
    connectAuthEmulator(auth, "http://localhost:9099");
}

const Sidebar = (props) => {
    const { navigateBack, navigateToPage } = useContext(NavigationContext);
    const { viewsData } = useContext(ViewsContext);

    function userSignOut() {
        signOut(auth).then(() => {
            window.location = "/login";
        }).catch((error) => {
            console.log("An error occurred during signout: " + error);
        });
    }

    function generateSidebarLinks() {
        if (!viewsData) {
            return null;
        }
        return (
            <>
                {viewsData.map((object) => {
                    return (
                        <a key={object.key} className={"nav-button"} onClick={() => {
                            navigateToPage(`/view`, { objectKey: object.key });
                        }}>{object.name}</a>
                    );
                })}
            </>
        );
    }

    let sidebarLinks = generateSidebarLinks();
    return (
        <div id="sidebar">
            <div id="sidebarLinksContainer">
                <h2 id="sidebarTitle">My Simple<br />{props.title}</h2>
                <a className={"nav-button"} onClick={() => navigateBack()}>Back</a>
                <a className={"nav-button"} onClick={() => navigateToPage("/", {})}>Home</a>
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