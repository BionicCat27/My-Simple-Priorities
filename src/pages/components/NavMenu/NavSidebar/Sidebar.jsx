import React, { useContext } from 'react';

import './Sidebar.css';

import githubLogo from '../../../../resources/GitHub_Logo.png'
import liLogo from '../../../../resources/LI-Logo.png'

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../contexts/AuthContext';

const Sidebar = (props) => {

    const {signUserOut} = useContext(AuthContext);

    const navigate = useNavigate();

    return (
        <div id="sidebar">
            <div id="sidebarLinksContainer">
                <h2 id="sidebarTitle">My Simple<br />{props.title}</h2>
                <a className={"nav-button"} onClick={() => navigate("/capture")}>Capture</a>
                <a className={"nav-button"} onClick={() => navigate("/priorities")}>Priorities</a>
                <a className={"nav-button"} onClick={() => navigate("/todo")}>Todo</a>
                <a className={"nav-button"} onClick={() => navigate("/review")}>Review</a>
                <a className={"nav-button"} onClick={() => navigate("/timeline")}>Timeline</a>
                <a className={"nav-button"} onClick={() => navigate("/health")}>health</a>
                <a className={"nav-button"} onClick={() => signUserOut()}>Logout</a>
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

export default Sidebar;