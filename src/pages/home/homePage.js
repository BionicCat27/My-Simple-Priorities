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

const HomePage = (props) => {
    const { user } = useContext(AuthContext);
    const { database } = useContext(DBContext);
    const { goToPage, setParameters, page } = useContext(NavigationContext);

    const [dbRef, setDbRef] = useState(undefined);

    const [views, setViews] = useState([]);

    //Set db ref on user set
    useEffect(() => {
        if (user) {
            if (dbRef) {
                off(dbRef);
            }
            setDbRef(ref(database, `users/${user.uid}/views`));
            setViews([]);
        }
    }, [user]);
    const [hash, setHash] = useState("");

    //Retrieve cards on dbref change
    useEffect(() => {
        if (!dbRef) {
            return;
        }
        if (!user) {
            console.log("Can't load content - no user found.");
            return;
        }
        onValue(dbRef, (snapshot) => {
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
    }, [dbRef]);

    function getPage() {
        switch (page) {
            case "#types":
                return <TypesPage />;
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
                    <h2 onClick={() => goToPage("#views")}>Views</h2>
                    <IndexList datatype={{ name: "Views", field: "views" }} fields={[{ name: "Name", field: "name" }, { name: "Description", field: "description" }]} objects={views} />
                </div>
            </div>
        </>
    );
};

export default HomePage;