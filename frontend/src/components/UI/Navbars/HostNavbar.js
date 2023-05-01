import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import emptyAvatar from '../../../assets/empty_avatar.png';


const HostNavbar = () => {
    const avatar = localStorage.getItem('avatar') !== 'null' ? localStorage.getItem('avatar') : null;

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        localStorage.clear();
        // reload the page
        window.location.reload();
    };
    return (
        <nav className="navbar navbar-expand-sm bg-light navbar-light sticky-top">
            <div className="container-fluid">
                <Link
                    className="navbar-brand fw-bold text-decoration-none"
                    to="/host"
                >
                    Restify
                </Link>
                <ul className="navbar-nav">
                    <li className="nav-item pt-2">
                        <Link
                            className="nav-link fw-semibold text-decoration-none"
                            to="/"
                        >
                            Switch to User
                        </Link>
                    </li>
                    <li className="nav-item pt-2">
                        <Link
                            className="nav-link fw-semibold text-decoration-none"
                            to="/hostnotifications"
                        >
                            Notifications
                        </Link>
                    </li>
                    <li className="nav-item dropdown">
                        <a
                            className="nav-link dropdown-toggle"
                            tabIndex="-1"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                        >
                            <img
                                src={avatar || emptyAvatar}
                                alt="avatar"
                                width="40"
                                height="40"
                                className="rounded-circle"
                            />
                        </a>

                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <Link
                                    className="dropdown-item fw-semibold text-decoration-none"
                                    to="/hostprofile"
                                >
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="dropdown-item fw-semibold text-decoration-none"
                                    to="/host/reservations"
                                >
                                    Reservations
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="dropdown-item fw-semibold text-decoration-none"
                                    to="/host/listings"
                                >
                                    My Properties
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="dropdown-item fw-semibold text-decoration-none"
                                    to="/"
                                    onClick={handleLogout}
                                >
                                    Log out
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default HostNavbar;
