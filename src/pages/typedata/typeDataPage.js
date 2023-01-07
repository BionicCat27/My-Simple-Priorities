//React
import React, { useEffect, useState, useContext } from 'react';
//Firebase
import { ref, onValue, off } from "firebase/database";
//Contexts
import { AuthContext } from "../../contexts/AuthContext";
import { DBContext } from '../../contexts/DBContext';
//Components
//Styles
//Config
import '../../firebaseConfig';
import IndexTable from '../../components/IndexTable/IndexTable';

const TypeDataPage = (props) => {
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