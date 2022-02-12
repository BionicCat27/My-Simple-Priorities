import React from 'react';

import './PageTitle.css';

const PageTitle = (props) => {
    return (
        <h1 id="pageTitle" className='text-center page-title'>{props.title}</h1>
    );
};

export default PageTitle;