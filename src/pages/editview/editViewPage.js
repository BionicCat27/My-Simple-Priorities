//React
import React, { useEffect, useState, useContext } from 'react';
//Firebase
import { ref, onValue, off, update } from "firebase/database";
//Contexts
import { NavigationContext } from '../../contexts/NavigationContext';
//Components
//Styles
import './editViewPage.css';
//Config
import '../../firebaseConfig';
import { AuthContext } from '../../contexts/AuthContext';
import { ViewsContext } from '../../contexts/ViewsContext';
import EditableText from '../../components/EditableText/EditableText';
import EditViewDisplaysList from '../../components/EditViewDisplaysList/EditViewDisplaysList';
import NavMenu from '../../components/NavMenu/NavMenu';

const EditViewPage = (props) => {
    const { user } = useContext(AuthContext);
    const { parameters, navigateToPage } = useContext(NavigationContext);
    const { getView, setViewValue } = useContext(ViewsContext);

    const [viewKey] = useState(parameters.objectKey);

    let view = getView(viewKey);
    useEffect(() => {
        if (!viewKey) navigateToPage("/", {});
    }, [viewKey]);

    if (view == "" || !view) {
        return (
            <div id="pageContent">
                <div id="pageContainer">
                </div>
            </div>
        );
    }
    let displays = [];
    if (view.displays) {
        displays = Object.keys(view.displays).map(key => {
            let display = view.displays[key];
            display.key = key;
            return display;
        });
    }

    return (
        <>
            <NavMenu title="Types" />
            <div id="pageContent">
                <div id="pageContainer">
                    <p><b>Title</b></p>
                    <EditableText value={view.name} fieldName="name" element={(content) => <h1>{content}</h1>} dbPath={viewKey} changeValue={setViewValue} />
                    <hr></hr>
                    <p><b>Description</b></p>
                    <EditableText value={view.description} fieldName="description" element={(content) => <p>{content}</p>} changeValue={setViewValue} dbPath={viewKey} />
                    <EditViewDisplaysList displays={displays} viewRef={`users/${user?.uid}/views/${viewKey}`} changeValue={setViewValue} parentKey={viewKey} />
                </div>
            </div>
        </>
    );
};

export default EditViewPage;