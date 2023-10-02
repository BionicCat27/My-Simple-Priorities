//React
import React, { useEffect, useState, useContext } from 'react';
//Firebase
import { ref, update, onValue, off } from "firebase/database";
//Contexts
import { AuthContext } from "../../contexts/AuthContext";
import { DBContext } from '../../contexts/DBContext';
//Components
import NavMenu from '../../components/NavMenu/NavMenu';
//Styles
import './timelinePage.css';
import './TimelineGantt.css';

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

const TimelineGantt = (props) => {

    const [cards, setCards] = useState(props.cards);
    const [longestDiff, setLongestDiff] = useState(-1);


    useEffect(() => {
        setCards(props.cards);
    }, [props.cards]);

    useEffect(() => {
        setLongestDiff(getLongestDiff(cards));
    }, [cards]);

    function getDaysDiff(x, y) {
        let xDate = new Date(x);
        let yDate = new Date(y);
        let milliDiff = xDate.getTime() - yDate.getTime();
        const milliInDay = 1000 * 60 * 60 * 24;
        let daysDiff = Math.ceil(milliDiff / milliInDay);
        return daysDiff;
    }

    function getLongestDiff(cards) {
        let longest = -1;
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            let cardDiff = getDaysDiff(card.dueDate, new Date());
            if (cardDiff > longest) {
                longest = cardDiff;
            }
        }
        return longest;
    }

    function generateHeader(length) {
        let output = [];
        output.push(<th key={`ganttHeader`}>Todo</th>);
        for (let i = 0; i < length; i++) {
            output.push(<th key={`ganttHeader${i}`}>{i + 1}</th>);
        }
        return <tr>{output}</tr>;
    }

    function generateCardBar(diff, longestDiff) {
        let output = [];
        output.push(<td className="ganttBlock ganttBar" colSpan={diff} key={`ganttBody`}></td>);
        for (let i = diff; i < longestDiff; i++) {
            output.push(<td className="ganttBlock" key={`ganttBody${i}`}></td>);
        }
        return <>{output}</>;
    }

    function generateCardBars(cards, longestDiff) {
        let output = [];
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            if (!card || !card.dueDate) {
                continue;
            }
            let diff = getDaysDiff(card.dueDate, new Date());
            if (diff < 1) continue;
            output.push(
                <tr key={`${card.index}${card.title}`}>
                    <td className="ganttCardName ganttBlock">{card.title}</td>
                    {generateCardBar(diff, longestDiff)}
                </tr>
            );
        }
        return <>{output}</>;
    }

    if (cards.length <= 0) {
        return <h1 className="emptyTitle">No cards to draw.</h1>;
    }
    return (
        <div className="ganttTableContainer">
            <table className="ganttTable">
                <thead>
                    {generateHeader(longestDiff)}
                </thead>
                <tbody>
                    {generateCardBars(cards, longestDiff)}
                </tbody>
            </table>
        </div>
    );
};

export default TimelinePage;