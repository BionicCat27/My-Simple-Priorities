import React from 'react';

import './Sidebar.css';

const Sidebar = () => {
    return (
        <div id="sidebar">
            <div id="sidebarLinksContainer">
                <a href="/">Home</a>
                <a href="/">About</a>
                <a href="/">Logout</a>
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
        </div>
    );
};

export default Sidebar;