import React from 'react';

import githubLogo from '../../resources/GitHub_Logo.png'
import liLogo from '../../resources/LI-Logo.png'

import './Footer.css';

const Footer = () => {
    return (
        <footer id="credit-footer">
            A project by <a href="https://aslanbb.vercel.app/">Aslan Bennington-Barr</a>
            <br />
            <a href="https://github.com/BionicCat27">
                <img id="githubLogo" src={githubLogo} />
            </a>
            <a href="https://www.linkedin.com/in/aslan-bennington-barr/">
                <img id="linkedinLogo" src={liLogo} />
            </a>
        </footer>);
};

export default Footer;