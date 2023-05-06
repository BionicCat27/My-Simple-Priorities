//React
import React, { useEffect, useState, useContext } from 'react';
//Firebase
//Contexts
import { TypesContext } from '../../contexts/TypesContext';
//Components
//Styles
import './typesPage.css';
//Config
import '../../firebaseConfig';
import IndexTable from '../../components/IndexTable/IndexTable';
import NavMenu from '../../components/NavMenu/NavMenu';

const TypesPage = (props) => {
    const { typesData } = useContext(TypesContext);

    return (
        <>
            <NavMenu title="Types" />
            <div id="pageContent">
                <div id="pageContainer">
                    <h1>Types</h1>
                    <hr></hr>
                    <IndexTable datatype={{ name: "Types", field: "types", target: "edittype" }} fields={[{ name: "Name", field: "name" }, { name: "Description", field: "description" }]} objects={typesData} />
                </div>
            </div>
        </>
    );
};

export default TypesPage;