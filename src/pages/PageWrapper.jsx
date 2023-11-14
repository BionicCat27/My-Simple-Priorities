import { useContext, useEffect } from "react";
import { AuthContext} from "../contexts/AuthContext";
import LoginPage from "./LoginPage";
import NavMenu from "./components/NavMenu/NavMenu";

const PageWrapper = (props)  => {
    const {user} = useContext(AuthContext)

    if(props.protected && !user) return <LoginPage />;
    return (
        <div>
            {props.navmenu && <NavMenu title={props.navmenu}/>}
            {props.page}
        </div>
    );
}

export default PageWrapper;