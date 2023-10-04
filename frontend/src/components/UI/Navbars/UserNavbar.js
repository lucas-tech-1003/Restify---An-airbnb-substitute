import { Link, Outlet } from 'react-router-dom';

import emptyAvatar from '../../../assets/empty_avatar.png';

const UserNavbar = () => {
    const token = localStorage.getItem('access') || null;
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
                    to="/"
                >
                    Restify
                </Link>
                <ul className="navbar-nav">
                    <li className="nav-item pt-2">
                        <Link
                            className="nav-link fw-semibold text-decoration-none"
                            to="/host"
                        >
                            Switch to Host
                        </Link>
                    </li>
                    <li className="nav-item pt-2">
                        <Link
                            className="nav-link fw-semibold text-decoration-none"
                            to="/usernotifications"
                        >
                            Notifications
                        </Link>
                    </li>
                    {token ? (
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
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
                                        to="/userprofile"
                                    >
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="dropdown-item fw-semibold text-decoration-none"
                                        to="/reservations"
                                    >
                                        My Reservations
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
                    ) : (
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                tabIndex="-1"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                            >
                                <img
                                    src={emptyAvatar}
                                    width="40"
                                    height="40"
                                    className="rounded-circle"
                                />
                            </a>

                            <ul className="dropdown-menu">
                                <li>
                                    <Link
                                        className="dropdown-item fw-semibold text-reset text-decoration-none"
                                        to="/signup"
                                    >
                                        Sign Up
                                    </Link>
                                </li>
                                <li>
                                <Link
                                        className="dropdown-item fw-semibold text-reset text-decoration-none"
                                        to="/login"
                                    >
                                        Log In
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    )}
                </ul>
            </div>
            <Outlet />
        </nav>
    );
};

export default UserNavbar;
