import { useContext, useEffect, useState } from "react";
import { DBContext } from "../contexts/DBContext";
import NavMenu from "./components/NavMenu/NavMenu";
import { Card } from "./components/Card";
import { EditableInput } from "./components/EditableInput";
import { useLocation } from "react-router";
import { EditableSelect } from "./components/EditableSelect";

const ScreensPage = () => {
    const { addDataListener, pushObject, ready } = useContext(DBContext);

    const [screens, setScreens] = useState([]);
    const [types, setTypes] = useState([]);
    const [input, setInput] = useState("");

    const location = useLocation();

    const pagePath = `screens`;

    useEffect(() => {
        if (ready) {
            addDataListener(pagePath, setScreens, true);
            addDataListener(`types`, setTypes);
        }
    }, [ready]);

    function addContent(event) {
        event.preventDefault();
        pushObject(pagePath, {
            'name': input
        });
        setInput("");
    }
    if (location.pathname === '/screens') {
        return (
            <>
                <NavMenu title="Screens" />
                <div>
                    <form onSubmit={addContent} id="contentForm">
                        <input autoFocus placeholder="Screen Name" value={input} onChange={field => setInput(field.target.value)} type="text" className="content_field" />
                        <button id="addContentButton" onClick={addContent}>Create</button>
                    </form>
                    <h1>Screens</h1>
                    {
                        screens && screens.map(screen =>
                            <ScreenCard card={screen}
                                types={types}
                                path={pagePath} />
                        )
                    }
                </div>
            </>
        );
    }
    let screenKey = location.pathname.split("/")[2];
    return (<ScreenPage path={`${pagePath}`} screenKey={screenKey} />);
};

const ScreenPage = (props) => {
    const { addDataListener, ready, pushObject, asKeyedList } = useContext(DBContext);

    const displaysMap = {
        'displays/list': {
            'name': 'List'
        }
    };
    const displaysList = asKeyedList(displaysMap);

    const screenKey = props.screenKey;
    const screenPath = `${props.path}/${screenKey}`;


    const [screen, setScreen] = useState();
    const [input, setInput] = useState("");

    useEffect(() => {
        if (ready) {
            addDataListener(screenPath, setScreen);
        }
    }, [ready]);

    function addContent(event, path) {
        event.preventDefault();
        pushObject(path, {
            'name': input
        });
        setInput("");
    }
    if (!screen) return <p>No screen found.</p>;
    const configuration = screen.configuration;
    const screenDisplays = asKeyedList(screen.displays);
    let screenTypes = asKeyedList(screen.types);
    let screenType;
    if (screenTypes?.length >= 1) {
        screenType = screenTypes[0];
    } else {
        return <>
            <NavMenu title={screen.name} />
            <p>No type associated with screen "{screen.name}."</p>
            <p><a href="/types">Create a Type</a> or <a href="/screens">Manage screens</a></p>
        </>;
    }
    let typePath = `types/${screenType.typeKey}/data`;
    return (
        <>
            <NavMenu title={screen.name} />
            <form onSubmit={event => addContent(event, typePath)} id="contentForm">
                <input autoFocus placeholder="Name" value={input} onChange={field => setInput(field.target.value)} type="text" className="content_field" />
                <button id="addContentButton" onClick={event => addContent(event, typePath)}>Create</button>
            </form>
            <div className={`flex-aligned-${configuration?.displays?.alignment}`}>
                {
                    screenDisplays && screenDisplays.map((display) => {
                        if (!display) return <p>Invalid display</p>;
                        const displayType = display.displayKey;
                        if (displayType === 'displays/list') {
                            return (
                                <ListDisplay type={screenType} display={display} />
                            );
                        }
                    })
                }
            </div>
        </>
    );
};

const ListDisplay = (props) => {
    const { ready, addDataListener, asKeyedList } = useContext(DBContext);
    const type = props.type;
    const display = props.display;
    const [typeObject, setTypeObject] = useState([]);
    const typeData = asKeyedList(typeObject?.data);
    const typeFields = asKeyedList(typeObject?.fields);

    let filteredData = typeData;
    if (typeData && display.filterField && display.filterFieldValue) {
        filteredData = filteredData.filter(datum => {
            let fields = datum?.fields;
            if (!fields) return false;
            return fields[display.filterField] === display.filterFieldValue;
        });
    }

    const typePath = `types/${type.typeKey}`;

    useEffect(() => {
        if (!ready) return;
        addDataListener(typePath, setTypeObject, false);
    }, [ready]);

    if (!typeData) return;
    return (
        <div key={`listDisplay/${type.typeKey}`} style={{ width: "100%" }}>
            <h3>{display.name}</h3>
            {filteredData && filteredData.map((datum) => {
                return <ListCard card={datum} typeFields={typeFields}
                    path={typePath} />;
            })}
        </div>
    );
};

const ListCard = (props) => {
    const { updateObject, asKeyedList } = useContext(DBContext);
    const card = props.card;
    if (!card) return <div className="card">No card prop found</div>;
    const cardPath = `${props.path}/data/${card.key}`;

    const fields = props.typeFields;

    const [input, setInput] = useState(card.name);

    function updateContent() {
        updateObject(cardPath, "name", input || "");
    }

    function resetContent() {
        setInput(card.name);
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
                    <EditableInput label={"Name"} value={input} setValue={setInput} />
                    <label>Fields</label>
                    {
                        fields && fields.map(field => {
                            return <FieldInput field={field} fields={fields} path={cardPath} />;
                        })
                    }
                </>
            }
        />
    );
};

const FieldInput = (props) => {
    const { updateObject, asKeyedList } = useContext(DBContext);

    const path = props.path;
    const field = props.field;
    const options = asKeyedList(field.options);

    if (field.fieldKey == "fields/select") {
        return (
            <EditableSelect label={field.name} path={`${path}/fields`} dataname={field.key} options={options} defaultOption="None" />
        );
    }
    return (
        <EditableInput label={field.name} path={`${path}/fields`} dataname={field.key} />
    );
};

const ScreenCard = (props) => {

    const { updateObject, pushObject, removeObject, asKeyedList } = useContext(DBContext);

    const card = props.card;
    if (!card) return;
    const cardPath = `${props.path}/${card.key}`;
    const displaysMap = {
        'displays/list': {
            'name': 'List'
        }
    };
    const displaysList = asKeyedList(displaysMap);
    const types = props.types;
    const typesList = asKeyedList(types);
    const screenTypes = asKeyedList(card.types);
    const configuration = card.configuration;
    const screenDisplays = asKeyedList(card.displays);

    const defaultSelectorInput = "None";

    const [input, setInput] = useState(card.name);
    const [typeSelectorInput, setTypeSelectorInput] = useState(defaultSelectorInput);
    const [displaySelectorInput, setDisplaySelectorInput] = useState(defaultSelectorInput);

    function addSelected(path, value, keyName) {
        if (value === defaultSelectorInput) {
            return;
        }
        let obj = {};
        obj[keyName] = value;
        pushObject(path, obj);
    }

    function toggleDisplayAlignment() {
        let value = true;
        if (configuration?.displays?.alignment == undefined) {
            value = true;
        } else {
            value = !configuration.displays.alignment;
        }
        updateObject(`${cardPath}/configuration`, "displays/alignment", value);
    }

    function updateContent() {
        updateObject(cardPath, "name", input || "");
    }

    function resetContent() {
        setInput(card.name);
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
                    <EditableInput label={"Name"} value={input} setValue={setInput} />
                    <label>Associated Types</label>
                    {
                        screenTypes && screenTypes.map(screenType => {
                            let type = types[screenType.typeKey];
                            if (!type) return;
                            return (
                                <div className="card" key={`typeCard/${screenType.key}`}>
                                    <p>{type.name}</p>
                                    <button onClick={() => { removeObject(`${cardPath}/types/${screenType.key}`); }}>Remove</button>
                                </div>
                            );
                        })
                    }
                    <EditableSelect label={""} value={typeSelectorInput} setValue={setTypeSelectorInput}
                        options={typesList} defaultOption={defaultSelectorInput} />
                    <button onClick={() => { addSelected(`${cardPath}/types`, typeSelectorInput, "typeKey"); }}>Associate Type</button>
                    <label>Displays</label>
                    {
                        screenDisplays && screenDisplays.map(display => {
                            return (
                                <>
                                    <DisplayCard card={display}
                                        path={cardPath}
                                        screenTypes={screenTypes}
                                        typesList={typesList}
                                    />
                                </>
                            );
                        })
                    }
                    <EditableSelect label={""} value={displaySelectorInput} setValue={setDisplaySelectorInput}
                        options={displaysList} defaultOption={defaultSelectorInput} />
                    <button onClick={() => { addSelected(`${cardPath}/displays`, displaySelectorInput, "displayKey"); }}>Add Display</button>
                    <button onClick={() => { toggleDisplayAlignment(); }}>Aligned {configuration?.displays?.alignment ? `Horizontally` : `Vertically`}</button>
                </>
            }
        />
    );
};

const DisplayCard = (props) => {
    const { updateObject, pushObject, ready, addDataListener, asKeyedList } = useContext(DBContext);

    const card = props.card;
    if (!card) return;
    const cardPath = `${props.path}/displays/${card.key}`;
    const screenTypes = asKeyedList(props.screenTypes);
    const typesList = asKeyedList(props.typesList);
    let screenType;
    if (screenTypes?.length >= 1) {
        screenType = screenTypes[0];
    }
    let typeObject = typesList[screenType.key];
    let typeFields = asKeyedList(typeObject.fields || []);
    if (!typeFields && typeFields != []) return <p>No valid type fields ({JSON.stringify(typeObject)})</p>;

    const [input, setInput] = useState(card.name);

    function updateContent() {
        updateObject(cardPath, "name", input || "");
    }

    function resetContent() {
        setInput(card.name);
    }

    let filterFieldKey = card.filterField;
    let filterField = typeFields?.find(field => field.key === filterFieldKey);
    let filterFieldOptions = asKeyedList(filterField?.options);

    console.log(`Type object: ${JSON.stringify(typeObject)}`);
    console.log(`Type fields: ${JSON.stringify(typeFields)}`);
    console.log(`Filter Field: ${JSON.stringify(filterFieldKey)}`);
    console.log(`Filter Field options: ${JSON.stringify(filterFieldOptions)}`);

    return (
        <Card card={card}
            cardPath={cardPath}
            updateContent={updateContent}
            resetContent={resetContent}
            viewComponent={
                <>
                    {card.name && <h3>{card.name}</h3>}
                    <h4>{card.displayKey}</h4>
                </>
            }
            editComponent={
                <>
                    <EditableInput label="Name" value={input} setValue={setInput} />
                    {typeFields && typeFields.length > 0 && 
                        <EditableSelect label={`Filter by Field`} path={`${cardPath}`} dataname={`filterField`} options={typeFields} defaultOption="None" /> }
                    {filterField &&
                        <EditableSelect label={`Filter by ${filterField.name}`} path={`${cardPath}`} dataname={`filterFieldValue`} options={filterFieldOptions} defaultOption="None" />
                    }
                </>
            }
        />
    );
};

export default ScreensPage;