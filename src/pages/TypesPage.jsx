import { useContext, useEffect, useState } from "react";
import { DBContext } from "../contexts/DBContext";
import NavMenu from "./components/NavMenu/NavMenu";
import { Card } from "./components/Card";
import { EditableInput } from "./components/EditableInput";

const TypesPage = () => {
    const {addDataListener, pushObject, ready} = useContext(DBContext)

    const [data, setData] = useState([]);
    const [input, setInput] = useState("");

    const pagePath = `types`
    const pageTitle = `Types`

    useEffect(()=> {
        if (ready) {
            addDataListener(pagePath, setData, true)
        }
    }, [ready])

    function addContent(event) {
        event.preventDefault();
        pushObject(pagePath, {
            'name': input
        })
        setInput("");
    }

    return (
        <>
            <NavMenu title={pageTitle}/>
           <div>
                <form onSubmit={addContent} id="contentForm">
                    <input autoFocus placeholder="Type Title" value={input} onChange={field => setInput(field.target.value)} type="text" className="content_field" />
                    <button id="addContentButton" onClick={addContent}>Create</button>
                </form>
                <h1>{pageTitle}</h1>
                {
                    data && data.map(datum => <TypesCard card={datum} path={pagePath}/>)
                }
            </div>
        </>
    )
}

const TypesCard = (props) => {

    const {updateObject} = useContext(DBContext)

    const card = props.card;
    if (!card) return;
    const cardPath = `${props.path}/${card.key}`;

    const [titleInput, setTitleInput] = useState(card.name);

    function updateContent() {
        updateObject(cardPath, "name", titleInput || "");
    }

    function resetContent() {
        setTitleInput(card.name);
    }

    return (
        <Card card={card}
            cardPath={cardPath} 
            updateContent={updateContent}
            resetContent={resetContent}
            viewComponent={
                <h3>{card.name}</h3>   
            }
            editComponent={
                <>
                    <EditableInput label={"Name"} value={titleInput} setValue={setTitleInput} />
                </>
            }
            />
    )

}

export default TypesPage;