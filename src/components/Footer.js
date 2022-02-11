import React from 'react';

import './Footer.css';

const Footer = () => {
    return (
        <footer id="credit-footer">
            A project by <a href="https://aslanbb.vercel.app/">Aslan Bennington-Barr</a>
            <br />
            <a href="https://github.com/BionicCat27">
                <img id="githubLogo" src="/resources/GitHub_Logo.png" />
            </a>
            <a href="https://www.linkedin.com/in/aslan-bennington-barr/">
                <img id="linkedinLogo" src="/resources/LI-Logo.png" />
            </a>
        </footer>);
};

export default Footer;