//React
import React, { useEffect, useState, useContext } from 'react';
//Contexts
//Components
//Styles
import './TimelineGantt.css';
import NavMenu from './components/NavMenu/NavMenu';
import { DBContext } from '../contexts/DBContext';

const TimelinePage = (props) => {
    const { ready, addDataListener } = useContext(DBContext);

    const [cards, setCards] = useState([]);
    const [sortAscending, setSortAscending] = useState(true)
    const [sortedCards, setSortedCards] = useState([]);
    const [ganttLength, setGanttLength] = useState(7);
    
    useEffect(() => {
        if (ready) {
            addDataListener("todo", setCards);  
        }
    }, [ready])

    useEffect(()=> {
        if (!cards) {
            return;
        }
        let mostDifference = 0;
        cards.forEach((card)=> {
            let differenceInDays = getDaysDiff(card.dueDate, new Date())
            if(differenceInDays > mostDifference) {
                mostDifference = differenceInDays - 1;
            }
        })
        setGanttLength(mostDifference > 7 ? mostDifference : 7);
        let sortedCards = [...cards];
        sortedCards.sort((a, b)=>{
                return getDaysDiff(a.dueDate, b.dueDate)
        })
        if(!sortAscending) {
            sortedCards = sortedCards.reverse()
        }
        setSortedCards(sortedCards); 

    }, [cards, sortAscending])

    function getDaysDiff(x, y) {
        let xDate = new Date(x);
        let yDate = new Date(y);
        let milliDiff = xDate.getTime() - yDate.getTime();
        const milliInDay = 1000 * 60 * 60 * 24;
        let daysDiff = Math.ceil(milliDiff / milliInDay);
        return daysDiff;
    }

    return (
        <>
            <NavMenu title="Timeline" />
            <div id="pageContent">
                <h2>Days Until Due</h2>
                <button onClick={()=>{setSortAscending(!sortAscending)}}>Sort by {sortAscending ?  "latest first" : "soonest first"}</button>
                <div className="ganttTableContainer">
                    <table className="ganttTable">
                        <thead>
                            <tr>
                                <th key={`ganttHeader`}>Today</th>
                                {
                                    Array.from( { length: ganttLength },
                                        (el, index) => {
                                            return (<th key={`header${index}`}>{index + 1}</th>);
                                        }
                                    )
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {sortedCards && sortedCards.map((card)=> {
                                if (!card.dueDate || card.status == "Done") return;
                                let daysUntilDue = getDaysDiff(card.dueDate, new Date());
                                if (daysUntilDue < 0) return;
                                return (
                                    <tr key={`${card.key}`}>
                                        <td className="ganttCardName ganttBlock" colSpan={daysUntilDue}>
                                            <div className='ganttBar'>
                                                <p>{card.title}</p>
                                                <p>{card.dueDate}</p>
                                            </div>
                                        </td>
                                        {
                                            Array.from( { length: ganttLength - daysUntilDue + 1 },
                                                (el, index) => {
                                                    return (<td key={`${card.key}/${index}`}></td>);
                                                }
                                            )
                                        }
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default TimelinePage;