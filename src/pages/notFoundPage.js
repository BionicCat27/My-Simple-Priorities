import React from 'react';
import PageTitle from '../components/PageTitle';

const NotFoundPage = () => {
    return (
        <div className="main-content">
            <div className="div-card text-center vertical-center">
                <PageTitle title="404 - Page Not Found!" />
                <p>We couldn't find this page! :(</p>
                <p>Try <a href="/login">logging</a> in!</p>
            </div>
        </div >
    );
};

export default NotFoundPage;