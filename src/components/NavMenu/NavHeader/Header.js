import React, { useContext, useState } from 'react';
import './Header.css';

import '../../../firebaseConfig';

import { getAuth, signOut, connectAuthEmulator } from "firebase/auth";
import { NavigationContext } from '../../../contexts/NavigationContext';
import { ViewsContext } from '../../../contexts/ViewsContext';

const auth = getAuth();
if (location.hostname === "localhost" && location.port === "5001") {
    connectAuthEmulator(auth, "http://localhost:9099");
}

const Header = (props) => {
    const { navigateToPage, navigateBack } = useContext(NavigationContext);
    const { viewsData } = useContext(ViewsContext);

    const [showMenu, setShowMenu] = useState(false);

    function userSignOut() {
        signOut(auth).then(() => {
            window.location = "/login";
        }).catch((error) => {
            console.log("An error occurred during signout: " + error);
        });
    }

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

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
        <header className="nav-header">
            <div className="title-container">
                <h1 id="title">My Simple {props.title}</h1>
                <button className="hamburger-btn" onClick={toggleMenu}>
                    <span className="hamburger-icon"></span>
                    <span className="hamburger-icon"></span>
                    <span className="hamburger-icon"></span>
                </button>
            </div>
            <nav className={`nav-list ${showMenu ? 'show' : ''}`}>
                <a className={"nav-button"} onClick={() => navigateBack()}>Back</a>
                <a className={"nav-button"} onClick={() => navigateToPage("/", {})}>Home</a>
                {sidebarLinks}
                <a className={"nav-button"} onClick={userSignOut}>Logout</a>
            </nav>
        </header>
    );

};

export default Header;