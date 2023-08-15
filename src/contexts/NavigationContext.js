import React, { useEffect, useState } from "react";

export const NavigationContext = React.createContext();

export const NavigationProvider = ({ children }) => {
    const [page, setPage] = useState(window.location.hash);
    const [pageHistory, setPageHistory] = useState([]);
    const [parameters, setParameters] = useState({});

    useEffect(() => {
        window.location.hash = page;
    }, [page]);

    function navigateBack() {
        if (!pageHistory || pageHistory.length == 0) {
            setPage("/home");
            setParameters({});
            setPageHistory([]);
            return;
        }
        let newPageHistory = [...pageHistory];
        let lastPageObject = newPageHistory.pop();
        navigate(lastPageObject.page);
        setPageHistory(newPageHistory);
        setParameters(lastPageObject.parameters);
    }

    function addParams(to, parameters) {
        let newPageHistory = [...pageHistory];
        let newPageObject = { page: page, parameters: parameters };
        newPageHistory.push(newPageObject);
        setPageHistory(newPageHistory);
        navigate(to);
        setParameters({});
    }

    return (
        <NavigationContext.Provider value={{
            navigateToPage: navigateToPage,
            navigateBack: navigateBack,
            page: page,
            parameters: parameters
        }}>{children}</NavigationContext.Provider>
    );
};