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
import { TypeProvider } from '../../contexts/TypeContext';

const ViewPage = (props) => {
    const { user } = useContext(AuthContext);
    const { navigateToPage, parameters } = useContext(NavigationContext);
    const { getView } = useContext(ViewsContext);

    const [viewKey] = useState(parameters.objectKey);

    let view = getView(viewKey);

    useEffect(() => {
        if (!viewKey) navigateToPage("#home");
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
            return (
                <TypeProvider key={`${display.type}`} user={user} typeKey={display.type}>
                    {renderDisplay(display)}
                </TypeProvider>);
        });
    }

    function renderDisplay(display) {
        switch (display.display) {
            case "listDisplay":
                return <ListDisplay display={display} />;
                break;
            default:
                return <p>Invalid display: {JSON.stringify(display)}</p>;
                break;
        }
    }

    return (
        <div id="pageContent">
            <div id="pageContainer">
                <h1>{view.name}</h1>
                <hr></hr>
                {renderDisplays()}
            </div>
        </div>
    );
};

export default ViewPage;