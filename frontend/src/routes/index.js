import React from 'react';
import { Route, Routes } from 'react-router-dom';

import RequireAuthentication from '../components/RequireAuthentication';

import HomePage from '../pages/HomePage';
import HostHomePage from '../pages/HostHomePage';
import ViewPropertyPage from '../pages/ViewPropertyPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import HostListings from '../pages/HostListingsPage';
import HostReservation from '../pages/ReservationPage/HostReservation';
import UserReservation from '../pages/ReservationPage/UserReservation';
import HostProfile from '../pages/HostProfilePage';
import UserProfile from '../pages/UserProfilePage';
import HostProfileUpdate from '../pages/HostEditProfilePage';
import UserProfileUpdate from '../pages/UserEditProfilePage';
import HostNotifications from '../pages/HostNotificationPage';
import UserNotifications from '../pages/UserNotificationPage';

const RenderRoutes = () => {
    return (
        <Routes>
            {/* User Home */}
            <Route exact path="/">
                <Route index element={<HomePage />} />
                {/* View Property */}
                <Route path="properties/:id/" element={<ViewPropertyPage />} />
                <Route
                    path="reservations"
                    element={
                        <RequireAuthentication>
                            <UserReservation userType="user" />
                        </RequireAuthentication>
                    }
                />
                <Route
                    path="host"
                    element={
                        <RequireAuthentication>
                            <HostHomePage />
                        </RequireAuthentication>
                    }
                />
                <Route
                    path="host/listings"
                    element={
                        <RequireAuthentication>
                            <HostListings />
                        </RequireAuthentication>
                    }
                />

                <Route
                    path="host/reservations"
                    element={
                        <RequireAuthentication>
                            <HostReservation userType="host" />
                        </RequireAuthentication>
                    }
                />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/hostprofile" element={<HostProfile />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route exact path="/userprofile/:id/" element={<UserProfile />} />
            <Route path="/hostprofile/update" element={<HostProfileUpdate />} />
            <Route path="/userprofile/update" element={<UserProfileUpdate />} />
            <Route path="/hostnotifications" element={<RequireAuthentication><HostNotifications /></RequireAuthentication>} />
            <Route path="/usernotifications" element={<RequireAuthentication><UserNotifications /></RequireAuthentication>} />
        </Routes>
    );
};

export default RenderRoutes;
