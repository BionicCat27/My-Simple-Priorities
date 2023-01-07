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
        let newPageHistory = [...pageHistory];
        let lastPageObject = newPageHistory.pop();
        setPage(lastPageObject.page);
        setPageHistory(newPageHistory);
        setParameters(lastPageObject.parameters);
    }

    function navigateToPage(to) {
        let newPageHistory = [...pageHistory];
        let newPageObject = { page: page, parameters, parameters };
        newPageHistory.push(newPageObject);
        setPageHistory(newPageHistory);
        setPage(to);
        setParameters({});
    }

    return (
        <NavigationContext.Provider value={{
            navigateToPage: navigateToPage,
            navigateToPage: navigateToPage,
            navigateBack: navigateBack,
            setParameters: setParameters,
            page: page,
            parameters: parameters
        }}>{children}</NavigationContext.Provider>
    );
};