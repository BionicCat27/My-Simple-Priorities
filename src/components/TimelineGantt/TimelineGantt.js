//React
import { runTransaction, set } from "firebase/database";
import React, { useEffect, useState } from "react";

//Styles
import './TimelineGantt.css';

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
            output.push(<th key={`ganttHeader${i}`}>{i}</th>);
        }
        return <tr>{output}</tr>;
    }

    function generateCardBar(diff, longestDiff) {
        let output = [];
        output.push(<td className="ganttBlock bar" colSpan={diff} key={`ganttBody`}></td>);
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
            if (diff < 1) return;
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

export default TimelineGantt;