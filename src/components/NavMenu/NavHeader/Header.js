import React, { useState } from 'react';
import './Header.css';

import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const auth = getAuth();

const Header = (props) => {
    const [showMenu, setShowMenu] = useState(false);

    const navigate = useNavigate();

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
                <a className={"nav-button"} onClick={() => navigate("/priorities")}>Priorities</a>
                <a className={"nav-button"} onClick={() => navigate("/todo")}>Todo</a>
                <a className={"nav-button"} onClick={() => navigate("/review")}>Review</a>
                <a className={"nav-button"} onClick={() => navigate("/timeline")}>Timeline</a>
                <a className={"nav-button"} onClick={userSignOut}>Logout</a>
            </nav>
        </header>
    );

};

export default Header;