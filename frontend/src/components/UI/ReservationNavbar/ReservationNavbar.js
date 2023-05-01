import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReservationNavbar = ({ setSelectedState }) => {
  const states = [
    'pending',
    'approved',
    'completed',
    'canceled',
    'denied',
    'expired',
    'terminated',
    'pending_cancel',
  ];

  const handleStateClick = (state) => {
    setSelectedState(state);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light ">
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav">
          {states.map((state) => (
            <li key={state} className="nav-item">
              <NavLink
                to="#"
                activeClassName="active"
                className="nav-link fw-bold text-capitalize color-danger"
                onClick={() => handleStateClick(state)}
              >
                {state.replace('_', ' ')}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default ReservationNavbar;
