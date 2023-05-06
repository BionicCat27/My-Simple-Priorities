//React
import React, { useEffect, useState, useContext } from 'react';
//Firebase
//Contexts
import { NavigationContext } from '../../contexts/NavigationContext';
//Components
//Styles
import './viewPage.css';
//Config
import '../../firebaseConfig';
import { AuthContext } from '../../contexts/AuthContext';
import ListDisplay from '../../components/Displays/ListDisplay/ListDisplay';
import { ViewsContext } from '../../contexts/ViewsContext';
import CardsDisplay from '../../components/Displays/CardsDisplay/CardsDisplay';
import NavMenu from '../../components/NavMenu/NavMenu';
import { useNavigate } from 'react-router';

const ViewPage = (props) => {
    const { user } = useContext(AuthContext);
    const { parameters } = useContext(NavigationContext);
    const { getView } = useContext(ViewsContext);

    const navigate = useNavigate();

    const [viewKey] = useState(parameters.objectKey);

    let view = getView(viewKey);

    useEffect(() => {
        if (!viewKey) navigate("/");
    }, [viewKey]);

    function renderDisplays() {
        if (!view || !view.displays) {
            return null;
        }
        let displays = [];
        displays = Object.keys(view.displays).map(key => {
            let display = view.displays[key];
            display.key = key;
            return display;
        });
        return displays.map((display) => {
            switch (display.display) {
                case "listDisplay":
                    return <ListDisplay key={`${display.type}list`} display={display} />;
                    break;
                case "cardsDisplay":
                    return <CardsDisplay key={`${display.type}cards`} display={display} />;
                    break;
                default:
                    return <p key={`${display.type}`}>Invalid display: {JSON.stringify(display)}</p>;
                    break;
            }
        });
    }

    if (!view) {
        return <p>No view found.</p>;
    }

    return (
        <>
            <NavMenu title="Types" />
            <div id="pageContent">
                <div id="pageContainer">
                    <h1>{view.name}</h1>
                    <hr></hr>
                    {renderDisplays()}
                </div>
            </div>
        </>
    );
};

export default ViewPage;