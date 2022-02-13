import React, { useState } from "react";

import './TodoCard.css';

const TodoCard = (props) => {
    const [showButtons, setShowButtons] = useState(false);
    const [editingTodo, setEditingTodo] = useState(false);
    const [todoTitleValue, setTodoTitleValue] = useState(props.title);
    const [todoDescriptionValue, setTodoDescriptionValue] = useState(props.description);
    const [todoTitleInputValue, setTodoTitleInputValue] = useState(props.title);
    const [todoDescriptionInputValue, setTodoDescriptionInputValue] = useState(props.description);

    function moveTodoUp() {
        let currentIndex = props.todoIndex;
        props.moveTodo(currentIndex, currentIndex - 1);
    }

    function moveTodoDown() {
        let currentIndex = props.todoIndex;
        props.moveTodo(currentIndex, currentIndex + 1);
    }

    function deleteTodo() {
        props.deleteTodo(props.todoIndex);
    }

    function updateTodoTitleInput(value) {
        setTodoTitleInputValue(value);
    }

    function updateTodoDescriptionInput(value) {
        setTodoDescriptionInputValue(value);
    }

    function updateTodo() {
        validateValues();
        setTodoTitleValue(todoTitleInputValue);
        setTodoDescriptionValue(todoDescriptionInputValue);
        setEditingTodo(false);
        let value = {
            title: todoTitleInputValue,
            description: todoDescriptionInputValue
        };
        props.updateTodo(props.todoIndex, value);
    }

    function validateValues() {
        if (todoTitleValue == undefined) {
            setTodoTitleValue("");
        }
        if (todoDescriptionValue == undefined) {
            setTodoDescriptionValue("");
        }
        if (todoTitleInputValue == undefined) {
            setTodoTitleInputValue("");
        }
        if (todoDescriptionInputValue == undefined) {
            setTodoDescriptionInputValue("");
        }
    }

    validateValues();

    if (editingTodo) {
        return (
            <div id="todoCard" onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
                <div id="todoContainer">
                    <label htmlFor="todoTitleInputValue">Title</label>
                    <input id="todoTitleInputValue" className="margin-y-1" onChange={field => updateTodoTitleInput(field.target.value)} value={todoTitleInputValue}></input>
                    <label htmlFor="todoDescriptionInputValue">Description</label>
                    <textarea id="todoDescriptionInputValue" className="margin-y-1" onChange={field => updateTodoDescriptionInput(field.target.value)} value={todoDescriptionInputValue}></textarea>
                </div>
                <div id="todoButtonContainer" className="button-block">
                    <button className="todo-button" onClick={updateTodo}>Done</button>
                </div>
            </div>
        );
    } else {
        return (
            <div id="todoCard" onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
                <div id="todoContainer">
                    <h3 onClick={() => setEditingTodo(true)}>{todoTitleValue}</h3>
                    {todoDescriptionValue && <p>{todoDescriptionValue}</p>}

                </div>
                {showButtons &&
                    <div id="todoButtonContainer" className="button-block">
                        {editingTodo
                            ? <button className="todo-button" onClick={updateTodo}>Done</button>
                            : <div>
                                <button className="todo-button" onClick={() => setEditingTodo(true)}>Edit</button>
                                <button className="todo-button" onClick={moveTodoUp}>Up</button>
                                <button className="todo-button" onClick={moveTodoDown}>Down</button>
                                <button className="todo-button" onClick={deleteTodo}>Delete</button>
                            </div>
                        }
                    </div>
                }
            </div >
        );
    }
};

export default TodoCard;