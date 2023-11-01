import { useContext, useEffect, useState } from "react";
import { DBContext } from "../contexts/DBContext";
import NavMenu from "./components/NavMenu/NavMenu";
import { Card } from "./components/Card";
import { EditableInput } from "./components/EditableInput";
import { EditableSelect } from "./components/EditableSelect";

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

    const {updateObject, pushObject, asKeyedList} = useContext(DBContext)

    const card = props.card;
    if (!card) return;
    const cardPath = `${props.path}/${card.key}`;
    const typeFields = asKeyedList(card.fields);

    const fieldsMap = {
        'fields/text': {
            'name': 'Text'
        },
        'fields/select': {
            'name': 'Select'
        }
    }
    const fieldsList = asKeyedList(fieldsMap);
    
    const defaultSelectorInput = "None";

    const [titleInput, setTitleInput] = useState(card.name);
    const [fieldSelectorInput, setFieldSelectorInput] = useState(defaultSelectorInput);

    function addSelected(path, value, keyName) {
        if (value === defaultSelectorInput) {
            return;
        }
        let obj = {};
        obj[keyName] = value;
        pushObject(path, obj);
    }
    
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
                    <label>Fields</label>
                    {
                        typeFields && typeFields.map(field => {
                            return (
                                <>
                                    <FieldCard card={field}
                                    path={cardPath}
                                    />
                                </>
                            );
                        })
                    }
                    <EditableSelect label={""} value={fieldSelectorInput} setValue={setFieldSelectorInput}
                    options={fieldsList} defaultOption={defaultSelectorInput} />
                    <button onClick={()=>{addSelected(`${cardPath}/fields`, fieldSelectorInput, "fieldKey")}}>Add Field</button>
                </>
            }
        />
    )
}

const FieldCard = (props) => {
    const {updateObject, pushObject, removeObject, asKeyedList} = useContext(DBContext)

    const card = props.card;
    const cardPath = `${props.path}/fields/${card.key}`;

    const [nameInput, setNameInput] = useState(card.name || "");
    const [optionInput, setOptionInput] = useState("");

    const options = asKeyedList(card.options);

    function addSelectOption() {
        pushObject(`${cardPath}/options`, {
            'name': optionInput
        });
        setOptionInput("");
    }

    function updateContent() {
        updateObject(cardPath, "name", nameInput || "");
    }

    function resetContent() {
        setNameInput(card.name);
        setOptionInput("");
    }

    return (
        <Card card={card}
        cardPath={cardPath}
        updateContent={updateContent}
        resetContent={resetContent}
        viewComponent={
            <>
                <h3>{card.name}</h3>
                <h4>{card.fieldKey}</h4>
            </>
        }
        editComponent={
            <>
                <EditableInput label="Name" value={nameInput} setValue={setNameInput} />
                {
                    card.fieldKey == "fields/select" && 
                    <>
                        <div>Select-field Options</div>
                        {
                            options && options.map(option => {
                                return <> 
                                    <OptionCard option={option} path={cardPath} /> 
                                </>
                            })
                        }
                        <EditableInput label={""} value={optionInput} setValue={setOptionInput}/>
                        <button onClick={() => addSelectOption()}>Add</button>
                    </>
                }
            </>
        }
        />
    )
}

const OptionCard = (props) => {
    const {updateObject, pushObject, removeObject, asKeyedList} = useContext(DBContext)

    const option = props.option;
    const path = `${props.path}/options/${option.key}`;

    const [input, setInput] = useState(option.name);

    function updateContent() {
        updateObject(path, "name", input || "");
    }

    function resetContent() {
        setInput(option.name);
    }

    return (
        <Card card={option} 
        cardPath={path}
        updateContent={updateContent}
        resetContent={resetContent}
        viewComponent={
            <>
                {option.name && <h3>{option.name}</h3>}
            </>
        }
        editComponent={
            <EditableInput label="Name" value={input} setValue={setInput} />
        }
        />
    );
}

export default TypesPage;