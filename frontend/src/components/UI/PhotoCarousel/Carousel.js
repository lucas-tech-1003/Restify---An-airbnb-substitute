import React, { useState } from 'react';
import { Carousel, Button, Stack } from 'rsuite';

import './MyCarousel.css';
import ImagePlaceholder from '../../../assets/image-placeholder.png';

const PhotoCarousel = ({
    photos,
    autoPlay = false,
    shape = 'dot',
    showButton = false,
}) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handlePrev = () => {
        setActiveIndex((prevIndex) => prevIndex - 1);
    };

    const handleNext = () => {
        setActiveIndex((prevIndex) => prevIndex + 1);
    };

    return photos.length > 0 ? (
        <>
            <Carousel
                className="custom-slider"
                autoplay={true}
                shape={shape}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
            >
                {photos.map((photo) => (
                    <div key={photo.id} className="image-container">
                        <img
                            className="img-fluid carousel-image"
                            src={photo.file}
                            alt={'created at' + photo.created_at}
                        ></img>
                    </div>
                ))}
            </Carousel>

            {showButton && (
                <div className="my-carousel-controls">
                    <Stack
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                    >
                        <Button
                            color="blue"
                            appearance='primary'
                            onClick={handlePrev}
                            disabled={activeIndex === 0}
                        >
                            &lt;
                        </Button>
                        <Button
                            color="blue"
                            appearance='primary'
                            onClick={handleNext}
                            disabled={activeIndex === photos.length - 1}
                        >
                            &gt;
                        </Button>
                    </Stack>
                </div>
            )}
        </>
    ) : (
        <Carousel className="custom-slider">
            <img src={ImagePlaceholder} alt="placeholder"></img>
        </Carousel>
    );
};

export default PhotoCarousel;
