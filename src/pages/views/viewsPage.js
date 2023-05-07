//React
import React, { useEffect, useState, useContext } from 'react';
//Firebase
//Contexts
import { ViewsContext } from '../../contexts/ViewsContext';
//Components
//Styles
import './viewsPage.css';
//Config
import '../../firebaseConfig';
import IndexTable from '../../components/IndexTable/IndexTable';
import NavMenu from '../../components/NavMenu/NavMenu';

const ViewsPage = (props) => {
    const { viewsData } = useContext(ViewsContext);

    return (
        <>
            <NavMenu title="Views" />
            <div id="pageContent">
                <div id="pageContainer">
                    <h1>Views</h1>
                    <hr></hr>
                    <IndexTable datatype={{ name: "Views", field: "views", target: "editview" }} fields={[{ name: "Name", field: "name" }, { name: "Description", field: "description" }]} objects={viewsData} />
                </div>
            </div>
        </>
    );
};

export default ViewsPage;