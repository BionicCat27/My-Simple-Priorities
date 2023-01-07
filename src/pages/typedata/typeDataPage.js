//React
import React, { useEffect, useState, useContext } from 'react';
//Firebase
//Contexts
//Components
//Styles
//Config
import '../../firebaseConfig';
import { NavigationContext } from '../../contexts/NavigationContext';

const TypeDataPage = (props) => {
    const { parameters } = useContext(NavigationContext);

    return (
        <div id="pageContent">
            <div id="pageContainer">
                <h1>Type Data</h1>
                <hr></hr>
            </div>
        </div>
    );
};

export default TypeDataPage;