import React, { useContext, useState } from 'react';
import './Header.css';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../contexts/AuthContext';

const Header = (props) => {
    const [showMenu, setShowMenu] = useState(false);

    const {signOut} = useContext(AuthContext);

    const navigate = useNavigate();

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
                <a className={"nav-button"} onClick={() => navigate("/capture")}>Capture</a>
                <a className={"nav-button"} onClick={() => navigate("/priorities")}>Priorities</a>
                <a className={"nav-button"} onClick={() => navigate("/todo")}>Todo</a>
                <a className={"nav-button"} onClick={() => navigate("/review")}>Review</a>
                <a className={"nav-button"} onClick={() => navigate("/timeline")}>Timeline</a>
                <a className={"nav-button"} onClick={() => signOut()}>Logout</a>
            </nav>
        </header>
    );

};

export default Header;