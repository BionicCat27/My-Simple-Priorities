//React
import React, { useEffect, useState, useContext } from 'react';
//Firebase
import { getAuth, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";
import { getDatabase, ref, update, onValue, off, connectDatabaseEmulator } from "firebase/database";
//Contexts
import { AuthContext } from "../../contexts/AuthContext";
import { DBContext } from '../../contexts/DBContext';
//Components
import NavMenu from '../../components/NavMenu/NavMenu';
import TimelineGantt from '../../components/TimelineGantt/TimelineGantt';
//Styles
import './timelinePage.css';
//Config
import '../../firebaseConfig';

const TimelinePage = (props) => {
    const { user } = useContext(AuthContext);
    const { database } = useContext(DBContext);

    const [dbRef, setDbRef] = useState(undefined);

    const [cards, setCards] = useState([]);

    //Set db ref on user set
    useEffect(() => {
        if (user) {
            if (dbRef) {
                off(dbRef);
            }
            setDbRef(ref(database, `users/${user.uid}/todo`));
            setCards([]);
        }
    }, [user]);

    //Retrieve cards on dbref change
    useEffect(() => {
        if (!dbRef) {
            console.log("Not logged in/no type");
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
                return;
            }
            //Validate card fields
            data.forEach((card, index) => {
                card.index = index;
                let needsSet = false;
                if (card.title == undefined) {
                    console.log("Title undefined");
                    card = { ...card, title: "" };
                    needsSet = true;
                }
                if (card.description == undefined) {
                    card = { ...card, description: "" };
                    needsSet = true;
                }
                if (card.status == undefined) {
                    card = { ...card, status: "" };
                    needsSet = true;
                }
                // if (card.checklist == undefined) {
                //     card = { ...card, checklist: [] };
                //     needsSet = true;
                // }
                //If a field was undefined, write the fully constructed object
                if (needsSet) {
                    console.log("Fixing undefined problem: " + JSON.stringify(card));
                    update(ref(database, 'users/' + user.uid + '/todo/' + index), {
                        ...card
                    });
                }
                return card;
            });
            setCards(data);
        });
    }, [dbRef]);
    return (
        <>
            <NavMenu title="Timeline" />
            <div id="pageContent">
                <TimelineGantt cards={cards} />
            </div>
        </>
    );
};

export default TimelinePage;