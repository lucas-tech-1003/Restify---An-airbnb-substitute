import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserNavbar from "../../components/UI/Navbars/UserNavbar";
import './style.css';

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const accessToken = localStorage.getItem('access');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:8000/notifications/'
      , {
        headers: {
            Authorization: `Bearer ${accessToken}`,
      }});
      setNotifications(response.data.results);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleClick = async (id) => {
    try {
      await axios.get(`http://localhost:8000/notifications/${id}/`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            }});
      setNotifications(notifications.filter((notification) => notification.id !== id));
    } catch (error) {
      console.error('Error setting notification as read:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <>
      <UserNavbar />
      <div className="container notifications-container">
        <h1>Notification</h1>
        <hr className="notifications-divider" />
        {notifications.map((notification) => (
          <div className="notification" key={notification.id} onClick={() => handleClick(notification.id)}>
            <p className="message">{notification.message}</p>
            <p className="timestamp">{formatDate(notification.created_at)}</p>
          </div>
        ))}
        {notifications.length === 0 && <h6>-Your message has been read-</h6>}
      </div>
    </>
  );
};

export default UserNotifications;
