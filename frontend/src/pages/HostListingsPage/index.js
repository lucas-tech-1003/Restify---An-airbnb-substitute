import React, { useState } from 'react';
import {
    Stack,
    Button,
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

import SearchComponent from '../../components/UI/Search/SearchContainer';
import HostNavbar from '../../components/UI/Navbars/HostNavbar';

const Textarea = React.forwardRef((props, ref) => (
    <Input {...props} as="textarea" ref={ref} />
));

const NewPropertyForm = ({ handleClose }) => {
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

    const requiredRule = Schema.Types.StringType().isRequired(
        'This field is required.'
    );

    const handleSubmit = () => {
        console.log(photos);
        if (!photos || photos.length < 3 || !amenities || !startAvailableDate) {
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
        formPostData.append('start_available_date', new moment(startAvailableDate).format('YYYY-MM-DD'));
        formPostData.append('beds', beds);
        formPostData.append('baths', baths);
        
        if (photos) {
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
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formPostData,
        };

        fetch(
            'http://127.0.0.1:8000/properties/host/listings/',
            requestOptions
        ).then((response) => {
            console.log(response);
            if (!response.ok) {
                const responseJson = response.json();
                const moreMessage = responseJson.amenities
                    ? 'Amenities not provided'
                    : '' + responseJson.uploaded_photos
                    ? 'Photos not uploaded'
                    : '';
                setError(
                    'Unsuccessful! Some fields were empty or not filled out correctly.' +
                        moreMessage
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
                        Required* Select at least three images.
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

const AddProperty = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <ButtonToolbar>
                <Button color="blue" onClick={handleOpen} appearance="primary">
                    New Property
                </Button>
            </ButtonToolbar>

            <Modal overflow={true} open={open} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title>Add New Property Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NewPropertyForm handleClose={handleClose} />
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button onClick={handleClose} appearance="primary">
                        Submit
                    </Button> */}
                    <Button onClick={handleClose} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

const HostListings = () => {
    return (
        <div>
            <HostNavbar />
            <div className="container">
                <Stack justifyContent="space-between" alignItems="baseline">
                    <h1>My Properties...</h1>
                    <AddProperty />
                </Stack>

                <SearchComponent isHosting={true} canEdit={true} />
            </div>
        </div>
    );
};

export default HostListings;
