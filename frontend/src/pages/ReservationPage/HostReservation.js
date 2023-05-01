
import React, { useState } from 'react';
import ReservationNavbar from '../../components/UI/ReservationNavbar/ReservationNavbar';
import HostReservationList from '../../components/UI/ReservationList/HostReservationList';
import HostNavbar from '../../components/UI/Navbars/HostNavbar';

const ReservationPage = ({ userType }) => {
  const [selectedStatus, setSelectedStatus] = useState('pending');

  return (
    <div>
      <HostNavbar />
      <ReservationNavbar setSelectedState={setSelectedStatus} />
      <div className="container-fluid p-2 border border-warning border-2 rounded">
        <HostReservationList selectedStatus={selectedStatus} userType={userType} />
      </div>
    </div>
  );
};

export default ReservationPage;




