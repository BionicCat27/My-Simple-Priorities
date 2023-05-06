//React
import React, { useContext, useEffect, useState } from 'react';
//Firebase
//Contexts
//Components
//Styles
import './homePage.css';
//Config
import '../../firebaseConfig';
import IndexList from '../../components/IndexList/IndexList';
import { NavigationContext } from '../../contexts/NavigationContext';
import { TypesContext } from '../../contexts/TypesContext';
import { ViewsContext } from '../../contexts/ViewsContext';
import NavMenu from '../../components/NavMenu/NavMenu';
import { useNavigate } from 'react-router';

const HomePage = (props) => {
    const { navigateToPage, navigateBack, page } = useContext(NavigationContext);
    const { typesData } = useContext(TypesContext);
    const { viewsData } = useContext(ViewsContext);

    const navigate = useNavigate();


    return (
        <>
            <NavMenu title="Home" />
            <div id="pageContent">
                <div id="pageContainer">
                    <h2 className={"clickable"} onClick={() => navigate("/types")}>Types</h2>
                    <IndexList datatype={{ name: "Types", field: "types", target: "type" }} fields={[{ name: "Name", field: "name" }, { name: "Description", field: "description" }]} objects={typesData} />
                    <h2 className={"clickable"} onClick={() => navigate("/views")}>Views</h2>
                    <IndexList datatype={{ name: "Views", field: "views", target: "view" }} fields={[{ name: "Name", field: "name" }, { name: "Description", field: "description" }]} objects={viewsData} />
                </div>
            </div>
        </>
    );
};

export default HomePage;