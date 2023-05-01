import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, Navigate, useLocation } from 'react-router-dom';
import countryList from 'react-select-country-list';
import { Divider, Stack, Loader, Button, Message } from 'rsuite';

import './property.css';

import UserNavbar from '../../components/UI/Navbars/UserNavbar';
import PhotoCarousel from '../../components/UI/PhotoCarousel/Carousel';
import ReviewList from '../../components/UI/ReviewList/ReviewList';

import starSVG from '../../assets/star-svgrepo-com.svg';
import emptyAvatar from '../../assets/empty_avatar.png';

const Capitalize = (str) => {
    return str.length > 1
        ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
        : str;
};

const Title = ({ title, rating, numReviews, city, province, country }) => {
    const countryName = countryList().getLabel(country);

    return (
        <section>
            <h2 style={{ color: 'black' }}>{title}</h2>
            <div className="ps-1">
                <span>
                    <img
                        src={starSVG}
                        width="15"
                        height="15"
                        alt="rating-star"
                        className="mb-1"
                    ></img>
                    <span className="h6 fw-bold"> {rating}</span>
                </span>
                <Divider vertical />
                <span className="h6 text-decoration-underline">
                    {numReviews} reviews
                </span>
                <Divider vertical />
                <div>
                    <span className="h6 text-decoration-underline">
                        {Capitalize(city)},{' '}
                    </span>
                    <span className="h6 text-decoration-underline">
                        {Capitalize(province)},{' '}
                    </span>
                    <span className="h6 text-decoration-underline">
                        {countryName}
                    </span>
                </div>
            </div>
        </section>
    );
};

const MainInfo = ({ numGuests, numBeds, numBaths, host, amenities }) => {
    const Amenities = ({ amenities }) => {
        return (
            <div className="border border-2 rounded p-3 mt-2">
                <div className="d-flex flex-wrap">
                    {amenities ? (
                        amenities.map((amenity) => {
                            return (
                                <div
                                    className="text-uppercase p-2 bg-danger bg-gradient text-white bg-opacity-70"
                                    style={{
                                        backgroundColor: '#f5f5f5',
                                        borderRadius: '5px',
                                        marginRight: '10px',
                                    }}
                                >
                                    {amenity.replace(/_/g, ' ')}
                                </div>
                            );
                        })
                    ) : (
                        <div className="h5"> No Amenities offered</div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="col-md-8 pb-2 border border-2 border-top-0 border-end-0 border-start-0">
                <h4>
                    Warmth home hosted by{' '}
                    <span className="text-capitalize">{host.first_name}</span>
                </h4>
                <Stack spacing={3}>
                    <span className="text-secondary fw-bold">
                        Max {numGuests} guests{' '}
                    </span>
                    <Divider vertical />
                    <span className="text-secondary fw-bold">
                        {numBeds} bedrooms{' '}
                    </span>
                    <Divider vertical />
                    <span className="text-secondary fw-bold">
                        {numBaths} bathrooms
                    </span>
                </Stack>
            </div>
            <div className="col-sm-2 float-end">
                <Link to={`/userprofile/${host.id}/`}>
                    <img
                        src={host.avatar || emptyAvatar}
                        className="rounded-circle"
                        alt="host-avatar"
                        width="50"
                        height="50"
                    />
                </Link>
            </div>
            <div className="row mt-2">
                <div className="col-md-8">
                    <h4>Amenities</h4>
                    <Amenities amenities={amenities} />
                </div>
            </div>
        </>
    );
};

const Description = ({ description }) => {
    const [showMore, setShowMore] = useState(false);
    const descriptionRef = useRef(null);

    useEffect(() => {
        const descriptionHeight = descriptionRef.current.clientHeight;
        const showMoreThreshold = 150;
        setShowMore(descriptionHeight > showMoreThreshold);
    }, []);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    return (
        <>
            <div className="col-md-8 pb-2 border border-2 border-top-0 border-end-0 border-start-0">
                <h3 className="mt-2" id="houseDescription">
                    About this space
                </h3>
                <div
                    className="description-box bg-light border border-1 border-opacity-75 rounded-3"
                    id="description-box"
                    style={{
                        maxHeight: showMore ? 'none' : '150px',
                        overflow: 'hidden',
                    }}
                    ref={descriptionRef}
                >
                    <p className="h4 p-2">
                        {description ||
                            'This host was too lazy to write down the description for this property.'}
                    </p>
                </div>
                <button
                    className="btn btn-primary mt-3"
                    onClick={toggleShowMore}
                >
                    {showMore ? 'Show Less' : 'Show More'}
                </button>
            </div>
        </>
    );
};

const PriceForm = ({ propertyID, price, guests }) => {
    const [checkin, setCheckin] = useState('');
    const [checkout, setCheckout] = useState('');
    const [numGuests, setNumGuests] = useState(1);
    const [message, setMessage] = useState({type: '', message: ''});

    const handleCheckinChange = (event) => {
        setCheckin(event.target.value);
    };

    const handleCheckoutChange = (event) => {
        setCheckout(event.target.value);
    };

    const handleGuestsChange = (event) => {
        setNumGuests(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage({type: '', message: ''});
        // Handle form submission
        // Check if checkin and checkout are not empty
        if (!checkin || !checkout) {
            alert('Checkin and checkout fields cannot be empty');
            return;
        }
        if (numGuests < 1) {
            alert('Number of guests cannot be less than 1');
            return;
        }
        if (numGuests > guests) {
            alert(`Number of guests cannot be more than ${guests}`);
            return;
        }

        // Check if user is authenticated
        const token = localStorage.getItem('access');
        if (!token) {
            alert('Please login to reserve');
            return;
        }
        // Send POST request to API
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                start_date: checkin,
                end_date: checkout,
                number_guests: numGuests,
            }),
        };

        fetch(
            `http://localhost:8000/properties/${propertyID}/view/reserve/`,
            requestOptions
        )
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if (data.detail) {
                    setMessage({type: 'error', message: data.detail});
                    return;
                }
                setMessage({type: 'success', message: 'Reservation made successfully'});
            })
            .catch((error) => {
                console.error(
                    'There was a problem with the fetch operation:', error
                );
                setMessage({type: 'error', message: error});
            });
    };

    return (
        <div className="container mt-5">
            <h3 className="text-center mb-3">Price Form</h3>
            <div className="row">
                <div className="col-lg-4 col-md-4 col-sm-12 offset-md-4">
                    <div className="price-form">
                        <div className="card-body">
                            <h5 className="card-title">
                                Price: ${price}/night
                            </h5>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="checkin">Check-in</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="checkin"
                                        value={checkin}
                                        onChange={handleCheckinChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="checkout">Check-out</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="checkout"
                                        value={checkout}
                                        onChange={handleCheckoutChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="numGuests">
                                        Number of Guests
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="numGuests"
                                        value={numGuests}
                                        onChange={handleGuestsChange}
                                    />
                                </div>
                                <button className="btn btn-primary btn-block mt-3">
                                    Reserve
                                </button>

                                {message.message && <Message closable type={message.type}>{message.message}</Message>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ViewPropertyPage = () => {
    const { id } = useParams();
    const [property, setProperty] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState([]);

    const fetchProperty = () => {
        fetch(`http://localhost:8000/properties/${id}/view/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setProperty(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const fetchReviews = () => {
        fetch(`http://localhost:8000/properties/${id}/reviews/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setReviews(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    useEffect(() => {
        fetchProperty();
        fetchReviews();
    }, []);

    if (isLoading) {
        return (
            <Loader center size="lg" speed="slow">
                Loading...
            </Loader>
        );
    }

    return (
        <>
            <UserNavbar />
            <div className="container">
                <Title
                    title={property.title}
                    rating={property.rating}
                    numReviews={property.num_reviews}
                    city={property.city}
                    province={property.province}
                    country={property.country}
                />
                <div className="container mt-4">
                    <PhotoCarousel
                        photos={property.photos}
                        autoPlay={true}
                        shape="bar"
                        showButton={true}
                    />
                </div>
                <div className="container mt-4">
                    <div className="row">
                        <MainInfo
                            numGuests={property.max_guests}
                            numBeds={property.beds}
                            numBaths={property.baths}
                            host={property.host}
                            amenities={property.amenities}
                        />
                    </div>

                    <div className="row pt-2">
                        <Description description={property.content} />
                    </div>

                    <div className="row">
                        <PriceForm propertyID={id} price={property.price} guests={property.max_guests} />
                    </div>
                </div>

                <div
                    className="container mt-4 mb-5 border border-2 border-bottom-0 border-start-0 border-end-0 "
                    id="reviewSection"
                >
                    <h3 className="mt-2">Reviews</h3>
                    <ReviewList reviews={reviews} readOnly={false} />
                </div>
            </div>
        </>
    );
};

export default ViewPropertyPage;
