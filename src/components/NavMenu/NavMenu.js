import React, { useState, useEffect } from 'react';
import Sidebar from './NavSidebar/Sidebar';
import Header from './NavHeader/Header';

function NavMenu(props) {
    const [isMobile, setIsMobile] = useState(false);

    const title = props.title;

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return isMobile ? <Header title={title} /> : <Sidebar title={title} />;
}

export default NavMenu;
