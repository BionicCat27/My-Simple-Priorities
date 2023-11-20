import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import LoginPage from "./LoginPage";
import NavMenu from "./components/NavMenu";
import { useNavigate } from "react-router";

const PageWrapper = (props)  => {
    const {user, loading} = useContext(AuthContext)
    const navigate = useNavigate();

    useEffect(()=>{
        if(!user) {
            navigate("/login")
        }
    }, [user])

    if(props.protected) {
        if(loading) {
            return;
        }
        if(!user) {
            return;
        }
    }
    return (
        <div>
            {props.navmenu && <NavMenu title={props.navmenu}/>}
            {props.page}
        </div>
    );
}

export default PageWrapper;