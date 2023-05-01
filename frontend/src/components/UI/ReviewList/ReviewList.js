import React, { useState, useEffect } from 'react';

import ReviewCard from './ReviewCard';
import { Button } from 'rsuite';

const ReviewList = ({ reviews, readOnly }) => {
    const [expanded, setExpanded] = useState(false);
    const initialReviewNext = reviews.next;
    const [next, setNext] = useState('');
    const [reviewList, setReviewList] = useState([]);

    useEffect(() => {
        setNext(reviews.next);
        setReviewList(reviews.results);
    }, [reviews.next]);

    const handleLoadMore = () => {
        console.log('load more');
        console.log('next', next);
        fetch(next)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Cannot find reviewer');
                }
                return response.json();
            })
            .then((data) => {
                setReviewList([...reviewList, ...data.results]);
                setNext(data.next);
            })
            .catch((error) => {
                console.error(error);
            });
    };
    return (
        <div>
            {reviewList?.map((review) => (
                <>
                    <ReviewCard
                        key={review.id}
                        review={review.review}
                        reviewerID={review.reviewer}
                        createdAt={review.created_at}
                        readOnly={readOnly}
                        reviewID={review.id}
                        propertyID={review.property}
                        reservationID={review.reservation}
                    />
                    <div
                        className="container ps-4"
                        style={{
                            maxHeight: expanded ? 'none' : '100px',
                            overflow: 'hidden',
                        }}
                    >
                        {review.responses.map((response) => (
                            <ReviewCard
                                key={response.id}
                                review={response.reply}
                                reviewerID={response.user}
                                createdAt={response.created_at}
                                readOnly={true}
                                reviewID={response.id}
                                isResponse={true}
                            />
                        ))}
                    </div>
                    <Button className="" onClick={() => setExpanded(!expanded)}>
                        {expanded ? 'Show Less' : 'Show More'}
                    </Button>
                </>
            ))}
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
                    All reviews are listed for you.
                </h5>
            )}
        </div>
    );
};

export default ReviewList;
