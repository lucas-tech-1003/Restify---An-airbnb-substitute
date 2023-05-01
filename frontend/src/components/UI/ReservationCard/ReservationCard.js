import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { Message, Rate } from 'rsuite';
import { Link } from 'react-router-dom';
import PropertyCard from '../PropertyCard/PropertyCard';

const AddReviewForm = ({ propertyID, reservationID, isHost }) => {
    const token = localStorage.getItem('access');
    const [review, setReview] = useState('');
    const [accuracy, setAccuracy] = useState(5);
    const [communication, setCommunication] = useState(5);
    const [cleanliness, setCleanliness] = useState(5);
    const [location, setLocation] = useState(5);
    const [checkin, setCheckin] = useState(5);
    const [value, setValue] = useState(5);
    const [error, setError] = useState('');
    const [errorType, setErrorType] = useState('error');

    const handleSubmit = () => {
        console.log('Review submitted');
        if (!review) {
            setError('Please enter a review');
            setErrorType('error');
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
                review: review,
                accuracy: accuracy,
                communication: communication,
                cleanliness: cleanliness,
                location: location,
                checkin: checkin,
                value: value,
            }),
        };
        const url = isHost
            ? `http://localhost:8000/properties/${propertyID}/reviews/${reservationID}/reviewguest/`
            : `http://localhost:8000/properties/${propertyID}/reviews/${reservationID}/addreview/`;
        fetch(url, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    console.log(
                        'Unable to add review. Status Code' +
                            response.status +
                            ': ' +
                            response.statusText
                    );
                }
                return response.json();
            })
            .then((data) => {
                console.log('This is your data', data);
                if (data.detail) {
                    setError(data.detail);
                    setErrorType('error');
                    return;
                }
                setErrorType('success');
                setError('Added review successfully!');
            });
    };
    return isHost ? (
        <div className="container">
            <h3>Review for Guest</h3>
            <textarea
                className="form-control"
                rows="3"
                value={review}
                onChange={(e) => setReview(e.target.value)}
            />
            <Button className="mt-3" onClick={handleSubmit}>
                Submit
            </Button>
            {error && (
                <Message type={errorType} header={errorType}>
                    {error}
                </Message>
            )}
        </div>
    ) : (
        <div className="container">
            <h3 className="mb-3">Give Ratings</h3>
            <div className="row mb-3">
                <div className="col-md-6">
                    <div className="h4">Accuracy:</div>
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-end">
                    <Rate
                        defaultValue={5}
                        onChange={(value) => setAccuracy(value)}
                    />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <div className="h4">Communication:</div>
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-end">
                    <Rate
                        defaultValue={5}
                        onChange={(value) => setCommunication(value)}
                    />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <div className="h4">Cleanliness:</div>
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-end">
                    <Rate
                        defaultValue={5}
                        onChange={(value) => setCleanliness(value)}
                    />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <div className="h4">Location:</div>
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-end">
                    <Rate
                        defaultValue={5}
                        onChange={(value) => setLocation(value)}
                    />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <div className="h4">Check-in:</div>
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-end">
                    <Rate
                        defaultValue={5}
                        onChange={(value) => setCheckin(value)}
                    />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <div className="h4">Value:</div>
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-end">
                    <Rate
                        defaultValue={5}
                        onChange={(value) => setValue(value)}
                    />
                </div>
            </div>
            <h3>Write a Review</h3>
            <textarea
                className="form-control"
                rows="3"
                value={review}
                onChange={(e) => setReview(e.target.value)}
            />
            <Button className="mt-3" onClick={handleSubmit}>
                Submit
            </Button>
            {error && (
                <Message type={errorType} header={errorType}>
                    {error}
                </Message>
            )}
        </div>
    );
};

const ReservationCard = ({ reservation, userType, fetchReservations }) => {
    const [showModal, setShowModal] = useState(false);
    const [currentAction, setCurrentAction] = useState('');
    const [reservationState, setReservation] = useState(reservation);
    const [propertyTitle, setPropertyTitle] = useState('');

    useEffect(() => {
        setReservation(reservation);
    }, [reservation]);
    const [property, setProperty] = useState(null);

    useEffect(() => {
        // Fetch property data for the given reservation
        const fetchPropertyTitle = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/properties/${reservation.property}/view/`
                );
                const propertyData = await response.json();
                setPropertyTitle(propertyData.title);
            } catch (error) {
                console.error('Error fetching property:', error);
            }
        };

        fetchPropertyTitle();
    }, [reservation.property]);

    const handleAction = (action) => {
        setCurrentAction(action);
        setShowModal(true);
    };

    const handleConfirm = async () => {
        switch (currentAction) {
            case 'cancel':
                await cancelReservation();
                break;
            case 'approve':
                await approveReservation();
                break;
            case 'approvecancel':
                await approveCancelReservation();
                break;
            case 'denycancel':
                await denyCancelReservation();
                break;
            case 'deny':
                await denyReservation();
                break;
            case 'terminate':
                await terminateReservation();
                break;
            case 'complete':
                await completeReservation();
                break;
            default:
                break;
        }
        setShowModal(false);
        fetchReservations();
        console.log('Reservations fetched'); // Add this line
    };

    const patchRequest = async (apiUrl) => {
        const response = await fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access')}`,
            },
        });
        const data = await response.json();
        console.log('API response status:', response.status, 'Data:', data);
        return data;
    };

    const cancelReservation = async () => {
        const updatedReservation = await patchRequest(
            `http://localhost:8000/reservations/${reservation.id}/cancel/`
        );
        setReservation(updatedReservation);
    };

    const approveReservation = async () => {
        const updatedReservation = await patchRequest(
            `http://localhost:8000/reservations/host/${reservation.id}/approved/`
        );
        setReservation(updatedReservation);
    };

    const denyReservation = async () => {
        const updatedReservation = await patchRequest(
            `http://localhost:8000/reservations/host/${reservation.id}/denied/`
        );
        setReservation(updatedReservation);
    };

    const approveCancelReservation = async () => {
        const updatedReservation = await patchRequest(
            `http://localhost:8000/reservations/host/${reservation.id}/approvedcancel/`
        );
        setReservation(updatedReservation);
    };

    const denyCancelReservation = async () => {
        const updatedReservation = await patchRequest(
            `http://localhost:8000/reservations/host/${reservation.id}/deniedcancel/`
        );
        setReservation(updatedReservation);
    };

    const terminateReservation = async () => {
        const updatedReservation = await patchRequest(
            `http://localhost:8000/reservations/host/${reservation.id}/terminate/`
        );
        setReservation(updatedReservation);
    };
    const completeReservation = async () => {
        const updatedReservation = await patchRequest(
            `http://localhost:8000/reservations/host/${reservation.id}/complete/`
        );
        setReservation(updatedReservation);
    };

    return (
        <div className="col-md-3 pb-3 text-dark text-decoration-none">
            <Card className="mb-3">
                <Card.Body>
                    <Link to={`/properties/${reservationState.property}/`}>
                        <Card.Title>{propertyTitle}</Card.Title>
                    </Link>
                    <Card.Text>Status: {reservationState.status}</Card.Text>
                    <Card.Text>
                        Start Date: {reservationState.start_date}
                    </Card.Text>
                    <Card.Text>End Date: {reservationState.end_date}</Card.Text>
                    <Card.Text>
                        Number of Guests: {reservationState.number_guests}
                    </Card.Text>

                    {userType === 'host' &&
                        reservationState.status === 'pending' && (
                            <>
                                <Button
                                    onClick={() => handleAction('approve')}
                                    className="mr-2"
                                >
                                    Approve
                                </Button>
                                <Button
                                    onClick={() => handleAction('deny')}
                                    variant="danger"
                                >
                                    Deny
                                </Button>
                            </>
                        )}
                    {userType === 'host' &&
                        reservationState.status === 'pending_cancel' && (
                            <>
                                <Button
                                    onClick={() =>
                                        handleAction('approvecancel')
                                    }
                                    className="mr-2"
                                >
                                    Approve cancel
                                </Button>
                                <Button
                                    onClick={() => handleAction('denycancel')}
                                    variant="danger"
                                >
                                    Deny cancel
                                </Button>
                            </>
                        )}
                    {userType === 'host' &&
                        reservationState.status === 'approved' && (
                            <>
                                <Button
                                    onClick={() => handleAction('terminate')}
                                >
                                    Terminate
                                </Button>
                                <Button
                                    onClick={() => handleAction('complete')}
                                    variant="danger"
                                >
                                    Complete
                                </Button>
                            </>
                        )}
                    {userType === 'host' &&
                        reservationState.status === 'completed' && (
                            <>
                                <Button
                                    onClick={() => handleAction('addReview')}
                                    className="mr-2"
                                >
                                    Add Review
                                </Button>
                            </>
                        )}
                    {userType === 'user' &&
                        reservationState.status === 'completed' && (
                            <>
                                <Button
                                    onClick={() => handleAction('addReview')}
                                    className="mr-2"
                                >
                                    Add Review
                                </Button>
                            </>
                        )}
                    {userType === 'user' &&
                        reservationState.status === 'approved' && (
                            <>
                                <Button
                                    onClick={() => handleAction('cancel')}
                                    className="mr-2"
                                >
                                    Cancel
                                </Button>
                            </>
                        )}

                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Action</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {currentAction === 'addReview' ? (
                                <AddReviewForm
                                    propertyID={reservation.property}
                                    reservationID={reservation.id}
                                    isHost={userType === 'host'}
                                />
                            ) : (
                                <>
                                    Are you sure you want to {currentAction}{' '}
                                    this reservation?
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </Button>
                            {currentAction === 'addReview' || (
                                <Button
                                    variant="primary"
                                    onClick={handleConfirm}
                                >
                                    Confirm
                                </Button>
                            )}
                        </Modal.Footer>
                    </Modal>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ReservationCard;
