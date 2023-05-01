import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import UserNavbar from '../../components/UI/Navbars/UserNavbar';
import ReviewCard from '../../components/UI/ReviewList/ReviewCard';
import './style.css';
import default_pic from '../../assets/empty_avatar.png';

const HostProfile = () => {
    const { id } = useParams();
    console.log(id);
    const [profileData, setProfileData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:8000/accounts/profile/${id}/`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                    setProfileData(data);
                    setIsAuthenticated(false);
                })
                .catch((error) => {
                    console.error('Error fetching profile data:', error);
                });
        } else {
            // Fetch the profile data here and update the state
            const accessToken = localStorage.getItem('access');

            if (!accessToken) {
                navigate('/login');
                return;
            }

            const requestOptions = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };
            fetch('http://localhost:8000/accounts/profile/', requestOptions)
                .then((response) => {
                    if (response.ok) {
                        setIsAuthenticated(true);
                        return response.json();
                    } else {
                        setIsAuthenticated(false);
                        throw new Error('Not authenticated');
                    }
                })
                .then((data) => {
                    setProfileData(data);
                    console.log(data);
                })
                .catch((error) => {
                    console.error('Error fetching profile data:', error);
                    navigate('/login');
                });
        }
    }, [navigate]);
    if (isAuthenticated && profileData) {
        return (
            <>
                {
                    <div>
                        <UserNavbar />
                        <div className="header__wrapper">
                            <header></header>
                            <div className="cols__container">
                                <div className="left__col">
                                    <div className="img__container">
                                        <img
                                            src={
                                                profileData.avatar ||
                                                default_pic
                                            }
                                            alt="User photo"
                                        />
                                        <span></span>
                                    </div>
                                    <h2>{`${profileData.first_name} ${profileData.last_name}`}</h2>
                                    <Link to="/userprofile/update">
                                        Update profile
                                    </Link>

                                    <ul className="about">
                                        <li>
                                            <strong>Username: </strong>
                                            {profileData.username}
                                        </li>
                                        <li>
                                            <strong>Email: </strong>
                                            {profileData.email}
                                        </li>
                                        <li>
                                            <strong>Phone: </strong>
                                            {profileData.phone}
                                        </li>
                                    </ul>
                                </div>
                                <div className="right__col">
                                    <ul>
                                        <li id="rev">Reviewed By You</li>
                                    </ul>
                                    <ul className="review-list">
                                        {/* Display the reviews from the JSON response here */}
                                        {profileData.reviews_from_host.map(
                                            (review) => {
                                                return (
                                                    <ReviewCard
                                                        review={review.review}
                                                        reviewerID={
                                                            review.reviewer
                                                        }
                                                        createdAt={
                                                            review.created_at
                                                        }
                                                        readOnly={true}
                                                        reviewID={review.id}
                                                        propertyID={
                                                            review.property
                                                        }
                                                        reservationID={
                                                            review.reservation
                                                        }
                                                    />
                                                );
                                            }
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </>
        );
    }
    if (!isAuthenticated && profileData) {
        return (
            <>
                {
                    <div>
                        <UserNavbar />
                        <div className="header__wrapper">
                            <header></header>
                            <div className="cols__container">
                                <div className="left__col">
                                    <div className="img__container">
                                        <img
                                            src={
                                                profileData.avatar ||
                                                default_pic
                                            }
                                            alt="User photo"
                                        />
                                        <span></span>
                                    </div>
                                    <h2>{`${profileData.first_name} ${profileData.last_name}`}</h2>

                                    <ul className="about">
                                        <li>
                                            <strong>Username: </strong>
                                            {profileData.username}
                                        </li>
                                        <li>
                                            <strong>Email: </strong>
                                            {profileData.email}
                                        </li>
                                        <li>
                                            <strong>Phone: </strong>
                                            {profileData.phone}
                                        </li>
                                    </ul>
                                </div>
                                <div className="right__col">
                                    <ul>
                                        <li id="rev">
                                            Reviewed By{' '}
                                            <span className="text-capitalize">
                                                {profileData.first_name}
                                            </span>
                                        </li>
                                    </ul>
                                    <ul className="review-list">
                                        {/* Display the reviews from the JSON response here */}
                                        {profileData.reviews_from_host.map(
                                            (review) => {
                                                return (
                                                    <ReviewCard
                                                        review={review.review}
                                                        reviewerID={
                                                            review.reviewer
                                                        }
                                                        createdAt={
                                                            review.created_at
                                                        }
                                                        readOnly={true}
                                                        reviewID={review.id}
                                                        propertyID={
                                                            review.property
                                                        }
                                                        reservationID={
                                                            review.reservation
                                                        }
                                                    />
                                                );
                                            }
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </>
        );
    }
};

export default HostProfile;
