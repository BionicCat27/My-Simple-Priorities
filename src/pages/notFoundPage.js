import React from 'react';

const NotFoundPage = () => {
    return (
        <div className="main-content">
            <h1 className="page-title">404 - Page Not Found!</h1>
            <div className="div-card text-center">
                <p>We couldn't find this page! :(</p>
                <p>Try <a href="/login">logging</a> in!</p>
            </div>
        </div >
    );
};

export default NotFoundPage;