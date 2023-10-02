//React
import React, { useEffect, useState, useContext } from 'react';
//Contexts
import { DBContext } from '../../contexts/DBContext';
//Components
import NavMenu from '../../components/NavMenu/NavMenu';
//Styles
import './timelinePage.css';
import './TimelineGantt.css';

const TimelinePage = (props) => {
    const { ready, addDataListener } = useContext(DBContext);

    const [cards, setCards] = useState([]);
    const ganttLength = 30;
    
    useEffect(() => {
        if (ready) {
            addDataListener("todo", setCards);   
        }
    }, [ready])

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
                <div className="ganttTableContainer">
                    <table className="ganttTable">
                        <thead>
                            <tr>
                                <th key={`ganttHeader`}>Today</th>
                                {
                                    Array.from( { length: ganttLength },
                                        (el, index) => {
                                            return (<th key={`header${index}`}>{index}</th>);
                                        }
                                    )
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {cards.map((card)=> {
                                let daysUntilDue = getDaysDiff(card.dueDate, new Date());
                                if (daysUntilDue < 0 || card.status == "Done") return;
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