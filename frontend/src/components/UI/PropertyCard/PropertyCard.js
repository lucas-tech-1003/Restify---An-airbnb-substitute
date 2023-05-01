import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import countryList from 'react-select-country-list';
import { Stack, Button } from 'rsuite';
import {
    Form,
    Uploader,
    ButtonToolbar,
    Modal,
    Message,
    Schema,
    DatePicker,
    Input,
} from 'rsuite';
import moment from 'moment';

import { MultiSelect } from 'react-multi-select-component';
import starSVG from '../../../assets/star-svgrepo-com.svg';

import PhotoCarousel from '../PhotoCarousel/Carousel';

const Textarea = React.forwardRef((props, ref) => (
    <Input {...props} as="textarea" ref={ref} />
));

const EditPropertyForm = ({ handleClose, id }) => {
    const token = localStorage.getItem('access') || '';
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [country, setCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [guest, setGuest] = useState('');
    const [content, setContent] = useState('');
    const [startAvailableDate, setStartAvailableDate] = useState('');
    const [endAvailableDate, setEndAvailableDate] = useState('');
    const [beds, setBeds] = useState('');
    const [baths, setBaths] = useState('');
    const [amenities, setAmenities] = useState([]);
    const [photos, setPhotos] = useState([]);

    const requiredRule = Schema.Types.StringType().isRequired(
        'This field is required.'
    );

    const amenitiesChoices = [
        ['wifi', 'Wifi'],
        ['tv', 'TV'],
        ['kitchen', 'Kitchen'],
        ['workspace', 'Workspace'],
        ['air_conditioning', 'Air Conditioning'],
        ['heating', 'Heating'],
        ['washer', 'Washer'],
        ['dryer', 'Dryer'],
    ].map((choice) => ({ label: choice[1], value: choice[0] }));

    useEffect(() => {
        // Get property data from API
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        fetch(
            `http://localhost:8000/properties/host/listings/${id}/edit/`,
            requestOptions
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error getting property data');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setTitle(data.title);
                setPrice(data.price);
                setStreet(data.street);
                setCity(data.city);
                setProvince(data.province);
                setCountry(countryList().getLabel(data.country) === 'United States' ? 'United States of America' : countryList().getLabel(data.country));
                setPostalCode(data.postal_code);
                setGuest(data.max_guests);
                setContent(data.content);
                setStartAvailableDate(data.start_available_date);
                setEndAvailableDate(data.end_available_date || '');
                setBeds(data.beds);
                setBaths(data.baths);
                setAmenities(
                    data.amenities.map((amenity) => ({
                        label: amenity,
                        value: amenity,
                    }))
                );
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleSubmit = () => {
        console.log(photos);
        if (!photos || !amenities || !startAvailableDate) {
            setError('Unsuccessful! Some fields were empty or not provided.');
            return;
        }
        const formPostData = new FormData();
        // Set the form data
        formPostData.append('title', title);
        formPostData.append('price', price);
        formPostData.append('street', street);
        formPostData.append('city', city);
        formPostData.append('province', province);
        formPostData.append('country', country);
        formPostData.append('postal_code', postalCode);
        formPostData.append('max_guests', guest);
        formPostData.append('content', content);
        formPostData.append(
            'start_available_date',
            new moment(startAvailableDate).format('YYYY-MM-DD')
        );
        formPostData.append('beds', beds);
        formPostData.append('baths', baths);

        if (photos) {
            console.log(photos);
            for (let i = 0; i < photos.length; i++) {
                formPostData.append('uploaded_photos', photos[i].blobFile);
            }
        }
        // add amenities
        for (let i = 0; i < amenities.length; i++) {
            formPostData.append('amenities', amenities[i].value);
        }
        if (endAvailableDate) {
            formPostData.append(
                'end_available_date',
                new moment(endAvailableDate).format('YYYY-MM-DD')
            );
        }
        console.log('submitting', formPostData);
        // Send POST request to API TODO: fix headers
        console.log('Edit property with id: ' + id);
        // Send POST request to API
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formPostData,
        };
        fetch(
            `http://localhost:8000/properties/host/listings/${id}/edit/`,
            requestOptions
        ).then((response) => {
            if (!response.ok) {
                setError(
                    'Unsuccessful! Please try again.' +
                        ' Status code: ' +
                        response.status +
                        '  ' +
                        response.statusText
                );
                return;
            }
            setError('');
            // Close the modal
            handleClose();
            // refresh page
            window.location.reload();
        });
    };

    return (
        <>
            <Form fluid onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.ControlLabel>Title</Form.ControlLabel>
                    <Form.Control
                        name="title"
                        value={title}
                        onChange={(value) => setTitle(value)}
                        placeholder="e.g. Cozy Apartment in Downtown"
                        rule={requiredRule}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.ControlLabel>Street</Form.ControlLabel>
                    <Form.Control
                        name="street"
                        value={street}
                        onChange={(value) => setStreet(value)}
                        placeholder="e.g. 123 Main St"
                        rule={requiredRule}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.ControlLabel>City</Form.ControlLabel>
                    <Form.Control
                        name="city"
                        placeholder="e.g. Toronto"
                        value={city}
                        onChange={(value) => setCity(value)}
                        rule={requiredRule}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.ControlLabel>Province</Form.ControlLabel>
                    <Form.Control
                        name="province"
                        placeholder="e.g. Ontario"
                        value={province}
                        onChange={(value) => setProvince(value)}
                        rule={requiredRule}
                    ></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.ControlLabel>Country</Form.ControlLabel>
                    <Form.Control
                        name="country"
                        placeholder="e.g. Canada"
                        value={country}
                        onChange={(value) => setCountry(value)}
                        rule={requiredRule}
                    ></Form.Control>
                    <Form.HelpText>
                        Make sure country is valid and in correct name.
                    </Form.HelpText>
                </Form.Group>
                <Form.Group>
                    <Form.ControlLabel>Postal Code</Form.ControlLabel>
                    <Form.Control
                        name="postalcode"
                        placeholder="e.g. M5V 2H1"
                        value={postalCode}
                        onChange={(value) => setPostalCode(value)}
                        rule={requiredRule}
                    ></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.ControlLabel>Amenities</Form.ControlLabel>
                    <MultiSelect
                        key={amenitiesChoices}
                        options={amenitiesChoices}
                        value={amenities}
                        labelledBy="Choose Amenities"
                        onChange={setAmenities}
                    />
                    <Form.HelpText>
                        Required* Select one or more amenities.
                    </Form.HelpText>
                </Form.Group>
                <Form.Group className="">
                    <Form.ControlLabel>Photos</Form.ControlLabel>
                    <Uploader
                        name="photos"
                        listType="picture"
                        autoUpload={false}
                        fileList={photos}
                        onChange={setPhotos}
                        draggable
                    >
                        <div
                            style={{
                                height: 200,
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <span>
                                Click or Drag files to this area to upload
                            </span>
                        </div>
                    </Uploader>
                    <Form.HelpText>
                        Required* Select one or more images.
                    </Form.HelpText>
                </Form.Group>
                <Form.Group>
                    <Form.ControlLabel>Price</Form.ControlLabel>
                    <Form.Control
                        name="price"
                        placeholder="e.g. 100"
                        value={price}
                        onChange={(value) => setPrice(value)}
                        rule={requiredRule}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.ControlLabel>Maximum Guests</Form.ControlLabel>
                    <Form.Control
                        name="guest"
                        placeholder="e.g. 5"
                        value={guest}
                        onChange={(value) => setGuest(value)}
                        rule={requiredRule}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.ControlLabel>Number of Bed</Form.ControlLabel>
                    <Form.Control
                        name="bed"
                        placeholder="e.g. 2"
                        value={beds}
                        onChange={(value) => setBeds(value)}
                        rule={requiredRule}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.ControlLabel>Number of Bath</Form.ControlLabel>
                    <Form.Control
                        name="bath"
                        placeholder="e.g. 2"
                        value={baths}
                        onChange={(value) => setBaths(value)}
                        rule={requiredRule}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.ControlLabel>Content</Form.ControlLabel>
                    <Form.Control
                        name="content"
                        placeholder='e.g. "This is a cozy apartment in downtown Toronto. It is close to the subway station and many restaurants."'
                        value={content}
                        onChange={(value) => setContent(value)}
                        rows={5}
                        accepter={Textarea}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.ControlLabel>Available Date</Form.ControlLabel>
                </Form.Group>
                <Stack direction="row" alignItems="space-between" spacing={6}>
                    <DatePicker
                        placeholder="Select Start Date"
                        onChange={setStartAvailableDate}
                    />
                    <DatePicker
                        placeholder="Select End Date"
                        onChange={setEndAvailableDate}
                    />
                </Stack>
                {error && (
                    <Message type="error" header="Error">
                        {error}
                    </Message>
                )}
                <Button appearance="primary" type="submit" className="mt-3">
                    Submit
                </Button>
            </Form>
        </>
    );
};

const EditProperty = ({ id }) => {
    const token = localStorage.getItem('access') || '';
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDeleteProperty = () => {
        console.log('Delete property with id: ' + id);
        // Send delete request to API
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        fetch(
            `http://localhost:8000/properties/host/listings/${id}/edit/`,
            requestOptions
        )
            .then((response) => {
                if (!response.ok) {
                    alert('Error deleting property');
                }
                window.location.reload();
                return response.json();
            })
            .then((data) => {
                console.log(data);
            });
    };

    return (
        <Stack
            direction="horizontal"
            spacing={6}
            className="mt-2"
            justifyContent="space-between"
        >
            <>
                <ButtonToolbar>
                    <Button
                        color="blue"
                        onClick={handleOpen}
                        appearance="primary"
                    >
                        Edit
                    </Button>
                </ButtonToolbar>

                <Modal overflow={true} open={open} onClose={handleClose}>
                    <Modal.Header>
                        <Modal.Title>Edit Property Form</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <EditPropertyForm handleClose={handleClose} id={id} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleClose} appearance="subtle">
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>

            <Button
                appearance="primary"
                color="red"
                size="sm"
                onClick={handleDeleteProperty}
            >
                Delete
            </Button>
        </Stack>
    );
};

const PropertyCard = ({
    id,
    photos,
    city,
    country,
    rating,
    numberReviews,
    price,
    carouselAutoPlay = false,
    carouselShape = 'dot',
    canEdit = false,
}) => {
    const token = localStorage.getItem('access') || '';

    const Capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const countryName = countryList().getLabel(country);

    const handleCarouselClick = (event) => {
        event.stopPropagation();
    };

    return (
        <div
            className="col-md-3 pb-3 text-dark text-decoration-none"
            aria-labelledby={id}
        >
            <Link
                to={`/properties/${id}`}
                className="text-reset text-decoration-none"
                onClick={handleCarouselClick}
            >
                <div className="card">
                    <PhotoCarousel
                        photos={photos}
                        autoPlay={carouselAutoPlay}
                        shape={carouselShape}
                    />
                    <div className="card-body">
                        <div className="row">
                            <div className="card-text h5 fw-bold">
                                {Capitalize(city)}, {countryName}
                            </div>
                        </div>
                        <Stack
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={1}
                        >
                            <span>
                                <img
                                    src={starSVG}
                                    width="12"
                                    height="12"
                                    alt="rating-star"
                                    className="mb-1"
                                ></img>
                                <span> {rating}</span>
                            </span>

                            <span>({numberReviews}) Reviews</span>
                        </Stack>

                        <span className="card-text fw-bold pt-3">
                            ${price} CAD
                        </span>
                        <span> / night</span>
                    </div>
                </div>
            </Link>
            {canEdit && <EditProperty id={id} />}
        </div>
    );
};

export default PropertyCard;
