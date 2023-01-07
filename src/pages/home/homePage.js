//React
import React, { useContext, useEffect, useState } from 'react';
//Firebase
//Contexts
//Components
//Styles
import './homePage.css';
//Config
import '../../firebaseConfig';
import TypesPage from '../types/typesPage';
import ViewsPage from '../views/viewsPage';
import IndexList from '../../components/IndexList/IndexList';
import { AuthContext } from '../../contexts/AuthContext';
import { DBContext } from '../../contexts/DBContext';
import { off, onValue, ref } from 'firebase/database';
import { NavigationContext } from '../../contexts/NavigationContext';
import ViewPage from '../view/viewPage';
import EditViewPage from '../editview/editViewPage';
import TypePage from '../type/typePage';
import EditTypePage from '../edittype/editTypePage';
import TypeDataPage from '../typedata/typeDataPage';
import { TypesContext } from '../../contexts/TypesContext';
import { ViewsContext } from '../../contexts/ViewsContext';

const HomePage = (props) => {
    const { navigateToPage, navigateBack, page } = useContext(NavigationContext);
    const { typesData } = useContext(TypesContext);
    const { viewsData } = useContext(ViewsContext);

    function getPage() {
        switch (page) {
            case "#types":
                return <TypesPage />;
            case "#type":
                return <TypePage />;
            case "#views":
                return <ViewsPage />;
            case "#view":
                return <ViewPage />;
            case "#editview":
                return <EditViewPage />;
            case "#edittype":
                return <EditTypePage />;
            case "#data":
                return <TypeDataPage />;
            default:
                return null;
        }
    }
    let contentPage = getPage();
    if (contentPage) {
        return (
            <>
                <h3 id="backBtn" className={"clickable"} onClick={() => navigateBack()}>Back</h3>
                {getPage()}
            </>);
    }
    return (
        <>
            <h3 id="backBtn" onClick={() => window.location.href = "/priorities"}>Back</h3>
            <div id="pageContent">
                <div id="pageContainer">
                    <h1>Home</h1>
                    <hr></hr>
                    <h2 className={"clickable"} onClick={() => navigateToPage("#types")}>Types</h2>
                    <IndexList datatype={{ name: "Types", field: "types", target: "type" }} fields={[{ name: "Name", field: "name" }, { name: "Description", field: "description" }]} objects={typesData} />
                    <h2 className={"clickable"} onClick={() => navigateToPage("#views")}>Views</h2>
                    <IndexList datatype={{ name: "Views", field: "views", target: "view" }} fields={[{ name: "Name", field: "name" }, { name: "Description", field: "description" }]} objects={viewsData} />
                </div>
            </div>
        </>
    );
};

export default HomePage;