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
import ViewsPage from '../views/viewsPage';

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
    if (window.location.hash == "#views") {
        return (
            <>
                <h3 id="backBtn" onClick={() => goTo("#home")}>Back</h3>
                <ViewsPage />
            </>
        );
    }
    return (
        <>
            <h3 id="backBtn" onClick={() => window.location.href = "/priorities"}>Back</h3>
            <div id="pageContent">
                <div id="pageContainer">
                    <h1>Home</h1>
                    <h2 onClick={() => goTo("#types")}>Types</h2>
                    <h2 onClick={() => goTo("#views")}>Views</h2>
                </div>
            </div>
        </>
    );
};

export default HomePage;