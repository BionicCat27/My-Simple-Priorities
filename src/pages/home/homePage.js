//React
import React, { useState } from 'react';
//Firebase
//Contexts
//Components
//Styles
import './homePage.css';
//Config
import '../../firebaseConfig';
import TypesPage from '../types/typesPage';

const HomePage = (props) => {
    const [hash, setHash] = useState("");

    function goTo(hash) {
        setHash(hash);
        window.location.hash = hash;
    }

    if (window.location.hash == "#types") {
        return (
            <>
                <h3 id="backBtn" onClick={() => goTo("#home")}>Back</h3>
                <TypesPage />
            </>
        );
    }
    if (window.location.hash == "#home") {
        return (
            <div id="pageContent">
                <div id="pageContainer">
                    <h1>Home</h1>
                    <h2 onClick={() => goTo("#types")}>Types</h2>
                </div>
            </div>
        );
    }
    return (
        <h1>Home</h1>
    );
};

export default HomePage;