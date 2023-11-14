import { useContext, useEffect, useState } from "react";
import { DBContext } from "../contexts/DBContext";
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
        <div>
            <h1>{pageTitle}</h1>
            <form onSubmit={addContent} id="contentForm">
                <input autoFocus placeholder="Type Title" value={input} onChange={field => setInput(field.target.value)} type="text" className="content_field" />
                <button id="addContentButton" onClick={addContent}>Create</button>
            </form>
            {
                data && data.map(datum => <TypesCard card={datum} path={pagePath} key={pagePath}/>)
            }
        </div>
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
                                <FieldCard card={field}
                                path={cardPath} key={`${cardPath}/${field.key}`}
                                />
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
                <h3 key={`${cardPath}/${card.key}/name`}>{card.name}</h3>
                <h4 key={`${cardPath}/${card.key}/fieldKey`}>{card.fieldKey}</h4>
            </>
        }
        editComponent={
            <>
                <EditableInput label="Name" value={nameInput} setValue={setNameInput} key={`${cardPath}/nameInput`}/>
                {
                    card.fieldKey == "fields/select" && 
                    <>
                        <div key={`${cardPath}/nameInput`}>Select-field Options</div>
                        {
                            options && options.map(option => {
                                return <OptionCard option={option} path={cardPath} key={`${cardPath}/optionCard/${option.key}`} /> 
                            })
                        }
                        <EditableInput label={""} value={optionInput} setValue={setOptionInput} onSubmit={addSelectOption} key={`${cardPath}/optionInput`}/>
                        <button onClick={() => addSelectOption()} key={`${cardPath}/addButton`}>Add</button>
                        <EditableSelect label={"Default Option"} path={cardPath} dataname={`defaultValue`} options={options} defaultOption="None" key={`${cardPath}/defaultInput`}/>
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