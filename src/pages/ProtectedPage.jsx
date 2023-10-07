import { useContext, useEffect } from "react";
import { AuthContext} from "../contexts/AuthContext";
import { Navigate, useLocation, useNavigate } from "react-router";
import LoginPage from "./login/loginPage";

const ProtectedPage = ({children})  => {
    const {user} = useContext(AuthContext)

    if(!user) return <LoginPage />;
    return <div>
        <h1>Protected page</h1>
        {children}
        </div>
}

export default ProtectedPage;