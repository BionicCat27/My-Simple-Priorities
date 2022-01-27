import React from 'react';
import ReacDOM from 'react-dom';
import Footer from './Footer.js';
import Description from './Description.js';

const App = () => {
    return (
        <div>
            <h1 id="PageTitle" className="text-center">My Simple Priorities</h1>
            <div id="PriorityContent" className="div-card main-content">
                <p>My Priorities</p>
                <input type="text" id="PriorityField" />
                <button id="PriorityButton">Add priority!</button>
                <div id="PrioritiesBlock">
                </div>
            </div>
            <Description />
            <Footer />
        </div>
    )
}

ReacDOM.render(
    <App />, document.getElementById("page_root")
)