import React, { useState } from "react";
import { render } from "react-dom";

function PageBuilder(props) {
    const [pageData, setPageData] = useState(props.data);
    const { title, components } = pageData;

    function renderComponent(componentData) {
        const { type, props: componentProps, children } = componentData;

        switch (type) {
            case "div":
                return (
                    <div {...componentProps}>{children && children.map(renderComponent)}</div>
                );
            default:
                return null;
        }
    }

    if (!pageData) {
        return null;
    }

    return <>{components && components.map(renderComponent)}</>;
}

export default PageBuilder;