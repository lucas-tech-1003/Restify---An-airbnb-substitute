import React, {useState} from 'react';
import { Link } from 'react-router-dom';

import HostNavbar from '../../components/UI/Navbars/HostNavbar';
import Footer from '../../components/UI/Footer/Footer';
import ReservationNavbar from '../../components/UI/ReservationNavbar/ReservationNavbar';
import HostReservationList from '../../components/UI/ReservationList/HostReservationList';

const MainSection = () => {
    const [selectedStatus, setSelectedStatus] = useState('pending');
    return (
        <>
            <div className="container p-5 h1 fw-semibold">
                <span>Welcome, </span>
                <span className="text-decoration-underline" id="username">
                    User
                </span>
            </div>

            <div className="container p-5 border border-light">
                <span className="h2">Your Reservations</span>
                <Link
                    className="h5 float-end text-decoration-underline m-0 mt-2"
                    to="reservations"   // TODO: add all reservations route
                >
                    All Reservations
                </Link>
                <ReservationNavbar setSelectedState={setSelectedStatus} />
                <div className="container mt-2 p-5 bg-light h-auto border border-0 rounded-4">
                
                <HostReservationList selectedStatus={selectedStatus} userType={'host'} />
                </div>
            </div>
        </>
    );
};

const HostHomePage = () => {
    return (
        <>
            <HostNavbar />
            <MainSection />
            <Footer />
        </>
    );
};

export default HostHomePage;
