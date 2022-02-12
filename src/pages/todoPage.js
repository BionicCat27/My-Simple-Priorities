import React, { useEffect, useState } from 'react';

import './todoPage.css';

import '../firebaseConfig';

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, onValue, update } from "firebase/database";

//Components
import PageTitle from '../components/PageTitle';
import TodoCard from "../components/TodoCard";
import Sidebar from '../components/Sidebar';

const auth = getAuth();
const database = getDatabase();

const TodoPage = () => {
    const [todoList, setTodoList] = useState([]);
    const [todoInput, setTodoInput] = useState("");
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        onAuthStateChanged(auth, (userResult) => {
            if (userResult) {
                setUser(userResult);
                onValue(ref(database, 'users/' + userResult.uid + '/todo'), (snapshot) => {
                    const data = snapshot.val();
                    if (data == null) {
                        console.log("An error occurred.");
                        return;
                    }
                    setTodoList(data);
                });
            } else {
                setUser(undefined);
                window.location = "/login";
            }
        });
    }, [auth]);

    function writeTodo(list_of_todo) {
        update(ref(database, 'users/' + user.uid), {
            todo: list_of_todo,
        });
    }

    function addTodo(event) {
        event.preventDefault();
        if (todoInput.length == 0) {
            return;
        }
        let concatList = [{
            title: todoInput,
            description: ""
        }].concat(todoList);
        setTodoList(concatList);
        setTodoInput("");
        writeTodo(concatList);
    }

    function onTodoInputChange(value) {
        setTodoInput(value);
    }

    function moveTodo(fromIndex, toIndex) {
        if (fromIndex < 0 || toIndex < 0 || fromIndex > todoList.length || toIndex > todoList.length) {
            console.log("An error occurred (" + fromIndex + " " + toIndex + " " + todoList + ")");
            return;
        }
        let workingList = todoList.slice();
        var element = workingList[fromIndex];
        workingList.splice(fromIndex, 1);
        workingList.splice(toIndex, 0, element);
        setTodoList(workingList);
        writeTodo(workingList);
    }

    function deleteTodo(index) {
        if (index < 0 || index > todoList.length) {
            console.log("An error occurred (" + index + " " + todoList + ")");
            return;
        }
        let workingList = todoList.slice();
        workingList.splice(index, 1);
        setTodoList(workingList);
        writeTodo(workingList);
    }

    function updateTodo(index, title, description) {
        let workingList = todoList.slice();
        workingList[index] = {
            title: title,
            description: description
        };
        setTodoList(workingList);
        writeTodo(workingList);
    }

    if (!user) return null;
    return (
        <div id="todoPage">
            <PageTitle title="My Simple Todo" />
            <div id="TodoContent" className="main-content div-card">
                <form onSubmit={addTodo}>
                    <input value={todoInput} onChange={field => onTodoInputChange(field.target.value)} type="text" id="todo_field" />
                    <button id="TodoButton" onClick={addTodo}>Add todo!</button>
                </form>
                <div id="todo-container">
                    {todoList.map((todo, index) => < TodoCard title={todo.title} description={todo.description} key={index + "" + todo.title} todoIndex={index} moveTodo={moveTodo} deleteTodo={deleteTodo} updateTodo={updateTodo} />)}
                </div>
            </div>
            <Sidebar />
        </div >
    );
};

export default TodoPage;