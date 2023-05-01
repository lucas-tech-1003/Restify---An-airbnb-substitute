import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { Stack, Divider, Form, Button, Message } from 'rsuite';

import EmptyAvatar from '../../../assets/empty_avatar.png';

const Avatar = ({
    avatar,
    userID,
    firstName,
    createdAt,
    isResponse = false,
}) => {
    return (
        <Link to={'/userprofile/' + userID + '/'} className="text-decoration-none">
            <Stack>
                <img
                    src={avatar || EmptyAvatar}
                    alt="avatar"
                    width="50"
                    height="50"
                    className="rounded-circle"
                />
                <Divider vertical />
                <Stack direction="column" className="container-fluid">
                    {isResponse && (
                        <span className="fw-bold text-reset">
                            Follow Up from{' '}
                        </span>
                    )}
                    <span className="fw-semibold text-capitalize">
                        {firstName}
                    </span>
                    <span className="text-muted">{createdAt}</span>
                </Stack>
            </Stack>
        </Link>
    );
};

const ReviewCard = ({
    review,
    reviewerID,
    createdAt,
    readOnly = false,
    reviewID,
    propertyID,
    reservationID,
    isResponse = false,
}) => {
    const [response, setResponse] = useState('');
    const [reviewer, setReviewer] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        // event.preventDefault();
        const url = `http://localhost:8000/properties/${propertyID}/reviews/${reviewID}/reply/`;
        const data = { reply: response };
        if (response.trim() === '') {
            setError('Reply message cannot be empty.');
            return;
        }
        try {
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access')}`,
                },
            });
            setResponse('');
            setError('');
            setShowForm(false);
        } catch (error) {
            console.error(error);
            setError("You don't have permission to reply to this review.");
        }
    };

    const fetchReviewerInfo = () => {
        const url = `http://localhost:8000/accounts/profile/${reviewerID}/`;
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Cannot find reviewer');
                }
                return response.json();
            })
            .then((data) => {
                setReviewer(data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchReviewerInfo();
    }, []);

    return (
        <div className="pb-3">
            <Avatar
                avatar={reviewer.avatar}
                userID={reviewer.id}
                firstName={reviewer.first_name}
                createdAt={createdAt.slice(0, 10)}
                isResponse={isResponse}
            />
            <p className="p-2 h6">{review}</p>
            {!readOnly && (
                <div>
                    <Button
                        appearance="primary"
                        onClick={() => {
                            setShowForm(!showForm);
                            setError('');
                        }}
                        className='flex-end'
                    >
                        {showForm ? 'Cancel' : 'Reply'}
                    </Button>
                    {showForm && (
                        <Form onSubmit={handleSubmit} fluid>
                            <Form.Group>
                                <Form.ControlLabel className="h5">
                                    Add Reply
                                </Form.ControlLabel>
                                <Form.Control
                                    value={response}
                                    onChange={(value) => setResponse(value)}
                                    name="textarea"
                                    rows={3}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Button appearance="primary" type="submit">
                                    Submit
                                </Button>

                                {error && (
                                    <Message
                                        showIcon
                                        type="error"
                                        header="Error"
                                    >
                                        {error}
                                    </Message>
                                )}
                            </Form.Group>
                        </Form>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReviewCard;
