import React, { useContext, useEffect, useState } from 'react';

import githubLogo from '../../../resources/GitHub_Logo.png';
import liLogo from '../../../resources/LI-Logo.png';

import { useNavigate } from 'react-router';
import { AuthContext } from '../../../contexts/AuthContext';
import './Header.css';
import './Sidebar.css';
import { DBContext } from '../../../contexts/DBContext';


function NavMenu(props) {
    const [isMobile, setIsMobile] = useState(false);

    const title = props.title;

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return isMobile ? <Header title={title} /> : <Sidebar title={title} />;
}

const Sidebar = (props) => {

    return (
        <div id="sidebar">
            <div id="sidebarLinksContainer">
                <h2 id="sidebarTitle">My Simple<br />{props.title}</h2>
                <LinksList />
            </div>
            <div id="sidebarCreditContainer">
                <a href="https://aslanbb.vercel.app/">Aslan Bennington-Barr</a>
                <br />
                <a href="https://github.com/BionicCat27">
                    <img id="githubLogo" src={githubLogo} />
                </a>
                <a href="https://www.linkedin.com/in/aslan-bennington-barr/">
                    <img id="linkedinLogo" src={liLogo} />
                </a>
            </div>
        </div >
    );
};

const Header = (props) => {
    const [showMenu, setShowMenu] = useState(false);

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
                <LinksList />
            </nav>
        </header>
    );

};

const LinksList = () => {
    const { signUserOut } = useContext(AuthContext);
    const { addDataListener } = useContext(DBContext);
    const navigate = useNavigate();

    const [screens, setScreens] = useState();

    useEffect(()=>{
        addDataListener(`screens`, setScreens, true)
    }, [])
    return (
        <>
            <a className={"nav-button"} onClick={() => navigate("/capture")}>Capture</a>
            <a className={"nav-button"} onClick={() => navigate("/goals")}>Goals</a>
            <a className={"nav-button"} onClick={() => navigate("/todo")}>Todo</a>
            <a className={"nav-button"} onClick={() => navigate("/review")}>Review</a>
            <a className={"nav-button"} onClick={() => navigate("/health")}>Health</a>
            <a className={"nav-button"} onClick={() => navigate("/screens")}>Screens</a>
            {
                screens && screens.map(screen => 
                    <a className={"nav-button"} onClick={() => navigate(`/screens/${screen.key}`)}>{screen.name}</a>
                )
            }
            <a className={"nav-button"} onClick={() => navigate("/types")}>Types</a>
            <a className={"nav-button"} onClick={() => signUserOut()}>Logout</a>
        </>
    );
};

export default NavMenu;
