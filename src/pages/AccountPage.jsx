//React
import React, { useState, useContext, useEffect } from 'react';
//Contexts
//Components
import { EditableInput } from './components/EditableInput';
//Styles
import PageTitle from './components/PageTitle';
import Footer from './components/Footer';
import { useNavigate } from 'react-router';
import { AuthContext } from '../contexts/AuthContext';

const AccountPage = () => {
    const { updateUsersPassword, user } = useContext(AuthContext);

    const [email, setEmail] = useState(user?.email);
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");


	function prepareUpdatePassword(event) {
		event.preventDefault();
		updateUsersPassword(password, setErrorMessage, setSuccessMessage);
	}

    return (
        <div id="pageContainer">
			<h1>Account</h1>
			<form className="block">
				<EditableInput disabled={true} label={"Email"} placeholder={"Email"} value={user?.email} setValue={setEmail} />
				<EditableInput label={"Password"} placeholder={"Password"} value={password} setValue={setPassword} />
				<button onClick={prepareUpdatePassword}>Update</button>
			</form>
            {errorMessage ? <p id="login-error-message">{errorMessage}</p> : null}
            {successMessage ? <p id="login-error-message">{successMessage}</p> : null}
        </div>
    );
};

export default AccountPage;
