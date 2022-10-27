import React, { useEffect, useState } from "react";

export const NavigationContext = React.createContext();

export const NavigationProvider = ({ children }) => {
    const [page, setPage] = useState(window.location.hash);
    const [parameters, setParameters] = useState({});

    useEffect(() => {
        window.location.hash = page;
    }, [page]);

    return (
        <NavigationContext.Provider value={{
            goToPage: setPage,
            setParameters: setParameters,
            page: page,
            parameters: parameters
        }}>{children}</NavigationContext.Provider>
    );
};