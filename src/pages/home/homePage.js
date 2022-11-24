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

const HomePage = (props) => {
    const { user } = useContext(AuthContext);
    const { database } = useContext(DBContext);
    const { goToPage, setParameters, page } = useContext(NavigationContext);

    const [viewsRef, setViewsRef] = useState(undefined);
    const [typesRef, setTypesRef] = useState(undefined);

    const [views, setViews] = useState([]);
    const [types, setTypes] = useState([]);

    //Set db ref on user set
    useEffect(() => {
        if (user) {
            if (viewsRef) {
                off(viewsRef);
            }
            if (typesRef) {
                off(typesRef);
            }
            setViewsRef(ref(database, `users/${user.uid}/views`));
            setTypesRef(ref(database, `users/${user.uid}/types`));
            setViews([]);
            setTypes([]);
        }
    }, [user]);
    const [hash, setHash] = useState("");

    //Retrieve cards on dbref change
    useEffect(() => {
        if (!viewsRef) {
            return;
        }
        if (!user) {
            console.log("Can't load content - no user found.");
            return;
        }
        onValue(viewsRef, (snapshot) => {
            const data = snapshot.val();
            if (data == null) {
                console.log("An error occurred.");
                setViews([]);
                return;
            }
            let keyedData = Object.keys(data).map((key) => {
                let value = data[key];
                value.key = key;
                return value;
            });
            setViews(keyedData);
        });
    }, [viewsRef]);

    useEffect(() => {
        if (!typesRef) {
            return;
        }
        if (!user) {
            console.log("Can't load content - no user found.");
            return;
        }
        onValue(typesRef, (snapshot) => {
            const data = snapshot.val();
            if (data == null) {
                console.log("An error occurred.");
                setTypes([]);
                return;
            }
            let keyedData = Object.keys(data).map((key) => {
                let value = data[key];
                value.key = key;
                return value;
            });
            setTypes(keyedData);
        });
    }, [typesRef]);

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
            default:
                return null;
        }
    }
    let contentPage = getPage();
    if (contentPage) {
        return (
            <>
                <h3 id="backBtn" onClick={() => goToPage("#home")}>Back</h3>
                {getPage()}
            </>);
    }
    return (
        <>
            <h3 id="backBtn" onClick={() => window.location.href = "/priorities"}>Back</h3>
            <div id="pageContent">
                <div id="pageContainer">
                    <h1>Home</h1>
                    <h2 onClick={() => goToPage("#types")}>Types</h2>
                    <IndexList datatype={{ name: "Types", field: "types", typeName: "type" }} fields={[{ name: "Name", field: "name" }, { name: "Description", field: "description" }]} objects={types} />
                    <h2 onClick={() => goToPage("#views")}>Views</h2>
                    <IndexList datatype={{ name: "Views", field: "views", typeName: "view" }} fields={[{ name: "Name", field: "name" }, { name: "Description", field: "description" }]} objects={views} />
                </div>
            </div>
        </>
    );
};

export default HomePage;