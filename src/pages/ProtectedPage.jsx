import { useContext, useEffect } from "react";
import { AuthContext} from "../contexts/AuthContext";
import { Navigate, useLocation, useNavigate } from "react-router";
import LoginPage from "./LoginPage";

const ProtectedPage = ({children})  => {
    const {user} = useContext(AuthContext)

    if(!user) return <LoginPage />;
    return <div>
        {children}
        </div>
}

export default ProtectedPage;