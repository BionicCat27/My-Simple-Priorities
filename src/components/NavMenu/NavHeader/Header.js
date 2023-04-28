import React, { useState } from 'react';
import './Header.css';

import '../../../firebaseConfig';

import { getAuth, signOut, connectAuthEmulator } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const auth = getAuth();
if (location.hostname === "localhost" && location.port === "5001") {
    connectAuthEmulator(auth, "http://localhost:9099");
}

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
                </button>
            </div>
            <nav className={`nav-list ${showMenu ? 'show' : ''}`}>
                <a onClick={() => navigate("/priorities")}>Priorities</a>
                <a onClick={() => navigate("/todo")}>Todo</a>
                <a onClick={() => navigate("/review")}>Review</a>
                <a onClick={() => navigate("/timeline")}>Timeline</a>
                <a onClick={userSignOut}>Logout</a>
            </nav>
        </header>
    );

};

export default Header;