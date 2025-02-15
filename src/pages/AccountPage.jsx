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
    const { updateUsersEmail, updateUsersPassword, user } = useContext(AuthContext);

	const initialEmail = user?.email;
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

	function prepareUpdateEmail(event) {
		event.preventDefault();
		if (initialEmail == email) {
			setErrorMessage("Email not updated. Enter a new email to continue.");
			return;
		}
		updateUsersEmail(email, setErrorMessage, setSuccessMessage);
	}

	function prepareUpdatePassword(event) {
		event.preventDefault();
		if (password.length < 6) {
			setErrorMessage("Password must be 6 or more characters.")
			return;
		}
		updateUsersPassword(password, setErrorMessage, setSuccessMessage);
		setPassword(""); 
	}

    return (
        <div id="pageContainer">
			<h1>Account</h1>
			<form className="block">
				<EditableInput label={"Email"} placeholder={"Email"} value={email} setValue={setEmail} />
				<button onClick={prepareUpdateEmail}>Update email</button>
				<EditableInput type={"password"} label={"Password"} placeholder={"Password"} value={password} setValue={setPassword} />
				<button onClick={prepareUpdatePassword}>Update password</button>
			</form>
            {errorMessage ? <p id="login-error-message">{errorMessage}</p> : null}
            {successMessage ? <p id="login-error-message">{successMessage}</p> : null}
        </div>
    );
};

export default AccountPage;
