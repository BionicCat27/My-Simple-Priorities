//React
import React from 'react';
import ViewsTableFormRow from './ViewsTableFormRow/ViewsTableFormRow';
const ViewsTable = (props) => {

    const NoViewContent = () => {
        return (
            <>
                <table>
                    <tbody>
                        <ViewsTableFormRow />
                    </tbody>
                </table>
                <h2>No views</h2>
            </>
        );
    };

    let views = props.views;
    if (!views) return <NoViewContent />;
    views = [...props.views];
    if (views.length == 0) return <NoViewContent />;

    return (
        <table>
            <tbody>
                <ViewsTableFormRow />
                {views.map((view) => {
                    if (view.name == null
                        && view.description == null
                        && view.key == null) {
                        return null;
                    }
                    console.log(view);
                    return (
                        <tr key={view.key}>
                            <td>{view.name}</td>
                            <td>{view.description}</td>
                        </tr>
                    );
                }
                )}
            </tbody>
        </table>
    );
};

export default ViewsTable;