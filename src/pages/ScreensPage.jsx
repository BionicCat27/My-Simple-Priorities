import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { DBContext } from "../contexts/DBContext";
import { Card } from "./components/Card";
import { EditableInput } from "./components/EditableInput";
import { EditableSelect } from "./components/EditableSelect";

const ScreensPage = () => {
    const { addDataListener, pushObject, ready } = useContext(DBContext);

    const [screens, setScreens] = useState([]);
    const [types, setTypes] = useState([]);
    const [input, setInput] = useState("");

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
    return (
        <div>
            <h1>Screens</h1>
            <form onSubmit={addContent} id="contentForm">
                <input autoFocus placeholder="Screen Name" value={input} onChange={field => setInput(field.target.value)} type="text" className="content_field" />
                <button id="addContentButton" onClick={addContent}>Create</button>
            </form>
            {
                screens && screens.map(screen =>
                    <ScreenCard card={screen}
                        types={types}
                        path={pagePath} />
                )
            }
        </div>
    );
};

export const ScreenPage = (props) => {
    const { addDataListener, ready, pushObject, asKeyedList } = useContext(DBContext);
    const params = useParams();

    const [screen, setScreen] = useState();
    const [input, setInput] = useState("");
    const [typeObject, setTypeObject] = useState([]);
    const [screenType, setScreenType] = useState([]);

    const pagePath = `screens`;

    useEffect(() => {
        if (ready) {
            const screenKey = params.screenId;
            const screenPath = `${pagePath}/${screenKey}`;
            setScreen();
            setScreenType();
            addDataListener(screenPath, setScreen);
        }
    }, [ready, params]);

    useEffect(() => {
        if (!screen) {
            return;
        }
        let screenTypes = asKeyedList(screen.types);
        if (!screenTypes || screenTypes.length < 1) {
            return;
        }
        let screenType = screenTypes[0];
        setScreenType(screenType);
    }, [screen]);

    useEffect(() => {
        if (ready && screenType) {
            const typeKey = screenType.typeKey;
            const typePath = `types/${typeKey}`;
            const handleTypeObject = (object) => {
                if (!object) return;
                object.key = typeKey;
                setTypeObject(object);
            };
            addDataListener(typePath, handleTypeObject, false);
        }
    }, [screenType]);

    if (!screen) {
        return <p>No screen found.</p>;
    } else if (!screenType || screenType.length < 1) {
        return (<>
            <p>No type associated with screen "{screen.name}."</p>
            <p><a href="/types">Create a Type</a> or <a href="/screens">Manage screens</a></p>
        </>);
    }
    const typeDatumPath = `types/${screenType.typeKey}/data`;


    function createDatumObject(datatype, path, object) {
        let fieldsSchema = asKeyedList(datatype?.fields);
        if (fieldsSchema) {
            fieldsSchema.forEach(field => {
                if (field.key in object) {
                    return;
                }
                // Populate any default fields
                let defaultValue = field.defaultValue;
                if (defaultValue) {
                    if (!object.fields) {
                        object.fields = {};
                    }
                    object.fields[field.key] = defaultValue;
                }
            });
        }
        pushObject(path, object);
    }

    function addContent(datatype, event, path) {
        event.preventDefault();
        createDatumObject(datatype, path, {
            'name': input
        });
        setInput("");
    }

    const configuration = screen.configuration;
    const screenDisplays = asKeyedList(screen.displays);

    return (
        <>
            <form onSubmit={event => addContent(typeObject, event, typeDatumPath)} id="contentForm">
                <input autoFocus placeholder="Name" value={input} onChange={field => setInput(field.target.value)} type="text" className="content_field" />
                <button id="addContentButton" onClick={event => addContent(typeObject, event, typeDatumPath)}>Create</button>
            </form>
            <div className={`flex-aligned-${configuration?.displays?.alignment}`}>
                {
                    screenDisplays && screenDisplays.map((display) => {
                        if (!display) return <p>Invalid display</p>;
                        const displayType = display.displayKey;
                        if (displayType === 'displays/list') {
                            return (
                                <ListDisplay type={typeObject} display={display} key={`${typeDatumPath}/display/${display.key}`} />
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
    if (!type) {
        return (
            <p>Error in Display: invalid type.</p>
        );
    }
    const typeData = asKeyedList(type?.data);
    const typeFields = asKeyedList(type?.fields);
    const [showDisplay, setShowDisplay] = useState(!display.hiddenByDefault);

    let filteredData = typeData;
    let fieldFilters = display.filters;
    if (typeData && fieldFilters) {
        Object.keys(fieldFilters).forEach(fieldFilterKey => {
            let fieldFilterValue = display.filters[fieldFilterKey];
            filteredData = filteredData.filter(datum => {
                let fields = datum?.fields;
                if (!fields) return false;
                let today = new Date();
                switch (fieldFilterValue) {
                    case '-1w':
                        var lastWeek = Date.parse(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7));
                        return Date.parse(fields[fieldFilterKey]) > lastWeek;
                    case '+1w':
                        var nextWeek = Date.parse(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7));
                        return Date.parse(fields[fieldFilterKey]) < nextWeek;
                    case 'None':
                        return true;
                    default:
                        return fields[fieldFilterKey] === fieldFilterValue;
                }
            });
        });
    }
    const typePath = `types/${type.key}`;

    if (!typeData) return;
    return (
        <div style={{ width: "100%" }}>
            <h3 className={`clickable ${!showDisplay && 'hide'}`} onClick={() => setShowDisplay(!showDisplay)}>{display.name}</h3>
            {showDisplay && filteredData && filteredData.map((datum) => {
                return <ListCard card={datum} typeFields={typeFields} highlightedField={display.highlightedField}
                    path={typePath} key={`${typePath}/card/${datum.key}`} />;
            })}
        </div>
    );
};

const ListCard = (props) => {
    const { updateObject, asKeyedList } = useContext(DBContext);
    const card = props.card;
    if (!card) return <div className="card">No card prop found</div>;
    const cardPath = `${props.path}/data/${card.key}`;

    const highlightedFieldKey = props.highlightedField;
    const fields = props.typeFields;

    const [input, setInput] = useState(card.name);

    function updateContent() {
        updateObject(cardPath, "name", input || "");
    }

    function resetContent() {
        setInput(card.name);
    }

    let highlightedFieldValue;
    let highlightedTypeField;
    if (highlightedFieldKey && card && 'fields' in card) {
        highlightedFieldValue = card.fields[highlightedFieldKey];
        highlightedTypeField = fields?.find((field) => field.key == highlightedFieldKey);
        if (highlightedTypeField?.fieldKey == 'fields/select') {
            let translatedFieldValue = highlightedTypeField?.options[highlightedFieldValue];
            highlightedFieldValue = translatedFieldValue?.name;
        }
    }

    return (
        <Card card={card}
            cardPath={cardPath}
            updateContent={updateContent}
            resetContent={resetContent}
            viewComponent={
                <div className="cardContentContainer">
                    <div id="col1">
                        <h3>{card.name}</h3>
                    </div>
                    <div id="col2">
                        {highlightedFieldValue &&
                            <h3 className={'floatRight'}>{highlightedTypeField?.name}: {highlightedFieldValue}</h3>
                        }
                    </div>
                </div>
            }
            editComponent={
                <>
                    <EditableInput label={"Name"} value={input} setValue={setInput} />
                    <label>Fields</label>
                    {
                        fields && fields.map(field => {
                            return <FieldInput field={field} fields={fields} path={cardPath} key={`${cardPath}/fieldInput/${field.key}`} />;
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
            <EditableSelect label={field.name} path={`${path}/fields`} dataname={field.key} options={options} defaultOption="None" key={`${path}/fieldInput`} />
        );
    } else if (field.fieldKey === 'fields/date') {
        return (
            <EditableInput key={`${path}/fieldInput`} label={field.name} path={`${path}/fields`} dataname={field.key} type={'date'} />
        );
    } else {
        return (
            <EditableInput key={`${path}/fieldInput`} label={field.name} path={`${path}/fields`} dataname={field.key} />
        );
    }
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


    return (
        <Card card={card}
            cardPath={cardPath}
            updateContent={updateContent}
            resetContent={() => { }}
            viewComponent={
                <h3>{card.name}</h3>
            }
            editComponent={
                <>
                    <EditableInput label="Name" path={cardPath} dataname={"name"} />
                    <label>Associated Types</label>
                    {
                        screenTypes && screenTypes.map(screenType => {
                            let type = types[screenType.typeKey];
                            if (!type) return;
                            return (
                                <AssociatedTypeCard type={type} screenPath={cardPath} screenTypePath={`${screenType.key}`} />
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

const AssociatedTypeCard = (props) => {
    return (
        <Card card={props.type}
            cardPath={`${props.screenPath}/types/${props.screenTypePath}`}
            resetContent={() => { }}
            viewComponent={
                <p>{props.type.name}</p>
            }
            editComponent={
                <>
                    <p>{props.type.name}</p>
                </>
            }
        />
    );
};

const DisplayCard = (props) => {
    const { updateObject, asKeyedList } = useContext(DBContext);

    const card = props.card;
    if (!card) return;
    const cardPath = `${props.path}/displays/${card.key}`;
    const screenTypes = asKeyedList(props.screenTypes);
    const typesList = props.typesList;
    let screenType;
    if (screenTypes?.length >= 1) {
        screenType = screenTypes[0];
    }
    if (!screenType) {
        return <p>No type selected for screen.</p>;
    }
    let typeObject = typesList.find(type => type.key === screenType.typeKey);
    if (!typeObject) return <p>Invalid type object for screen type: {JSON.stringify(screenType)} vs {JSON.stringify(typesList)}</p>;
    let typeFields = asKeyedList(typeObject.fields || []);
    if (!typeFields && typeFields != []) return <p>No valid type fields ({JSON.stringify(typeObject)})</p>;

    const [hiddenByDefault, setHiddenByDefault] = useState(card.hiddenByDefault || false);

    function updateContent() {
        updateObject(cardPath, "hiddenByDefault", hiddenByDefault || false);
    }

    return (
        <Card card={card}
            cardPath={cardPath}
            updateContent={updateContent}
            resetContent={() => { }}
            viewComponent={
                <>
                    {card.name && <h3>{card.name}</h3>}
                    <h4>{card.displayKey}</h4>
                </>
            }
            editComponent={
                <>
                    <EditableInput label="Name" path={cardPath} dataname={"name"} />
                    <label>Options</label>
                    <div>
                        <input className="inline-input" type="checkbox" checked={hiddenByDefault} onChange={field => setHiddenByDefault(field.target.checked)} />
                        <label className="inline-input">Hidden By Default</label>
                    </div>
                    {/* {typeFields && typeFields.length > 0 &&
                        <EditableSelect label={`Filter by Field`} path={`${cardPath}`} dataname={`filterField`} options={typeFields} defaultOption="None" /> } */}
                    <EditableSelect label={`Highlighted Field`} path={cardPath} dataname={`highlightedField`} options={typeFields} defaultOption="None" />
                    {typeFields && typeFields.length > 0 &&
                        <>
                            <label>Field filters</label>
                            {typeFields.map(field => {
                                let filterFieldOptions = asKeyedList(field.options);
                                switch (field.fieldKey) {
                                    case 'fields/select':
                                        return <EditableSelect label={`${field.name} Filter`} path={`${cardPath}/filters`} dataname={field.key} options={filterFieldOptions} defaultOption="None" />;
                                    case 'fields/date':
                                        return <EditableSelect label={`${field.name} Filter`} path={`${cardPath}/filters`} dataname={field.key} options={[{ 'key': '-1w', 'name': '1 Week Before' }, { 'key': '+1w', 'name': '1 Week After' }]} defaultOption="None" />;
                                    default:
                                        return <p>Invalid: {field.fieldKey}</p>;
                                }
                            })}
                        </>}
                </>
            }
        />
    );
};

export default ScreensPage;