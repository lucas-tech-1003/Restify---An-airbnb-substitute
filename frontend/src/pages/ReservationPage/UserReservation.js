import React, { useState } from 'react';
import ReservationNavbar from '../../components/UI/ReservationNavbar/ReservationNavbar';
import UserReservationList from '../../components/UI/ReservationList/UserReservationList';
import UserNavbar from '../../components/UI/Navbars/UserNavbar';

const ReservationPage = ({ userType }) => {
    const [selectedStatus, setSelectedStatus] = useState('pending');

    return (
        <div>
            <UserNavbar />
            <ReservationNavbar setSelectedState={setSelectedStatus} />
            <div className="container-fluid p-2 border border-warning border-2 rounded">
                <UserReservationList
                    selectedStatus={selectedStatus}
                    userType={userType}
                />
            </div>
        </div>
    );
};

export default ReservationPage;
