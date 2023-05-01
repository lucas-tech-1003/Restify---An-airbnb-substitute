import React, { useEffect, useState } from 'react';
import { Button } from 'rsuite';
import ReservationCard from '../ReservationCard/ReservationCard';

const HostReservationList = ({ selectedStatus, userType }) => {
    const [reservations, setReservations] = useState([]);
    const [next, setNext] = useState('');
    const [refreshKey, setRefreshKey] = useState(0); // Add this line
    const handleRefresh = () => {
        setRefreshKey((prevKey) => prevKey + 1); // Add this function
    };

    const fetchReservations = async (url) => {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access')}`, // Include the token in the Authorization header
            },
        });
        const data = await response.json();
        console.log('Fetched reservations:', data);
        console.log('Data received from backend:', data);

        if (
            url ===
            `http://localhost:8000/reservations/host/?status=${selectedStatus}`
        ) {
            setReservations(data.results);
        } else {
            setReservations((prevReservations) => [
                ...prevReservations,
                ...data.results,
            ]);
        }
        setNext(data.next);
    };

    useEffect(() => {
        fetchReservations(
            `http://localhost:8000/reservations/host/?status=${selectedStatus}`
        );
    }, [selectedStatus, userType]);

    const handleLoadMore = () => {
        if (next) {
            fetchReservations(next);
        }
    };

    return (
        <div className="row p-2">
            {reservations.length === 0 ? (
                <p>There is no {selectedStatus} reservation.</p>
            ) : (
                reservations.map((reservation) => (
                    <ReservationCard
                        key={reservation.id}
                        reservation={reservation}
                        userType={userType}
                        fetchReservations={fetchReservations}
                    />
                ))
            )}
            {next ? (
                <div className="d-flex justify-content-center">
                    <Button
                        color="orange"
                        appearance="primary"
                        className="mx-auto"
                        onClick={handleLoadMore}
                    >
                        Load More
                    </Button>
                </div>
            ) : (
                <h5 className="text-center mb-5">
                    All properties are listed for you.
                </h5>
            )}
        </div>
    );
};

export default HostReservationList;
