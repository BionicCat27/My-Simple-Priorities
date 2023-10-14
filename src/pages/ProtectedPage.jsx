import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import LandingPage from "./LandingPage";

const ProtectedPage = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) return <LandingPage />;
    return (
        <div>
            {children}
        </div>
    );
};

export default ProtectedPage;