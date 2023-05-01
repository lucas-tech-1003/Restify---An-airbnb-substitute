import React from 'react';

import SearchComponent from '../../components/UI/Search/SearchContainer';
import UserNavbar from '../../components/UI/Navbars/UserNavbar';
import Footer from '../../components/UI/Footer/Footer';

const HomePage = () => {
    return (
        <>
            <UserNavbar />
            <SearchComponent />
            <Footer />
        </>
    );
};

export default HomePage;
