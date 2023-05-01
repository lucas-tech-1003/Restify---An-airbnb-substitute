import React, { useState } from 'react';

import {
    RangeSlider,
    Row,
    Col,
    InputGroup,
    InputNumber,
    SelectPicker,
    DateRangePicker,
} from 'rsuite';
import moment from 'moment';
import 'rsuite/dist/rsuite.css';
import { MultiSelect } from 'react-multi-select-component';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const PriceRange = ({ setMinPrice, setMaxPrice }) => {
    const [value, setValue] = React.useState([0, 2000]);
    return (
        <Row>
            <Col md={10}>
                <RangeSlider
                    progress
                    style={{ marginTop: 16 }}
                    value={value}
                    min={0}
                    max={2000}
                    onChange={(value) => {
                        setValue(value);
                        setMinPrice(value[0]);
                        setMaxPrice(value[1]);
                    }}
                />
            </Col>

            <Col md={8}>
                <InputGroup>
                    <InputNumber
                        min={0}
                        max={2000}
                        value={value[0]}
                        onChange={(nextValue) => {
                            const [start, end] = value;
                            if (nextValue > end) {
                                return;
                            }
                            setValue([nextValue, end]);
                            setMinPrice(nextValue);
                        }}
                    />
                    <InputGroup.Addon>to</InputGroup.Addon>
                    <InputNumber
                        min={0}
                        max={2000}
                        value={value[1]}
                        onChange={(nextValue) => {
                            const [start, end] = value;
                            if (start > nextValue) {
                                return;
                            }
                            setValue([start, nextValue]);
                            setMaxPrice(nextValue);
                        }}
                    />
                </InputGroup>
            </Col>
        </Row>
    );
};

const FilterForm = ({
    setQuery,
    filters,
    setFilters,
    orderBy,
    setOrderBy,
    cityOptions,
    provinceOptions,
    countryOptions,
    amenitiesChoices,
    setIsLoading,
    setNext,
    initialNext,
}) => {
    const [showFilter, setShowFilter] = useState(false);
    const [thisOrderBy, setThisOrderBy] = useState('');
    const [city, setCity] = useState([]);
    const [province, setProvince] = useState([]);
    const [country, setCountry] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [guestMin, setGuestMin] = useState(1);
    const [maxPrice, setMaxPrice] = useState(2000);
    const [minPrice, setMinPrice] = useState(0);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    function handleSelect(renderValue) {
        setStartDate(renderValue[0]);
        setEndDate(renderValue[1]);
    }

    const orderOptions = [
        { label: 'Price - Ascending', value: 'price' },
        { label: 'Price - Descending', value: '-price' },
        { label: 'Rating - Ascending', value: 'rating' },
        { label: 'Rating - Descending', value: '-rating' },
    ];

    return (
        <>
            <button
                type="button"
                className="btn openBtn mb-2"
                onClick={(e) => {
                    setShowFilter(true);
                }}
            >
                Filter
            </button>
            <button
                type="button"
                className="btn text-light-blue text-decoration-underline"
                onClick={() => {
                    setFilters({
                        city: [],
                        province: [],
                        country: [],
                        price_min: '',
                        price_max: '',
                        max_guests_min: '',
                        max_guests_max: '',
                        available_date_after: '',
                        available_date_before: '',
                        amenities: [],
                    });
                    setOrderBy('');
                    setThisOrderBy('');
                    setCity([]);
                    setProvince([]);
                    setCountry([]);
                    setAmenities([]);
                    setGuestMin(1);
                    setMaxPrice(2000);
                    setMinPrice(0);
                    setStartDate('');
                    setEndDate('');
                    setQuery('');
                }}
            >
                Clear Filter/Reset
            </button>

            {showFilter && (
                <div id="searchFilter" className="container form-control">
                    <div className="d-flex justify-content-end">
                        <button
                            type="button"
                            className="btn-close btn-lg"
                            aria-label="Close"
                            onClick={(e) => {
                                setShowFilter(false);
                            }}
                        ></button>
                    </div>

                    <div className="container text-start">
                        <div className="container-fluid">
                            <div className="row mt-4">
                                <div className="col">
                                    <div className="h3 text-left">Order By</div>
                                    <SelectPicker
                                        data={orderOptions}
                                        value={thisOrderBy}
                                        onChange={(value) => {
                                            setThisOrderBy(value);
                                        }}
                                        placeholder="Please select order-by."
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <div className="h3 text-left">
                                        Price Range
                                    </div>
                                    <PriceRange
                                        setMinPrice={setMinPrice}
                                        setMaxPrice={setMaxPrice}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <div className="h3 text-left">
                                        Choose Date Period
                                    </div>
                                    <DateRangePicker
                                        format="yyyy-MM-dd"
                                        placeholder="Select Date"
                                        onChange={handleSelect}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <div className="h3 text-left p-0">
                                        Location
                                    </div>
                                    <h4 className="ps-3">Choose City</h4>
                                    <MultiSelect
                                        options={cityOptions.map((city) => ({
                                            label: city,
                                            value: city,
                                        }))}
                                        value={city}
                                        labelledBy="Choose City"
                                        placeholder="Please select your destination cities."
                                        onChange={setCity}
                                    />
                                    <h4 className="ps-3">Choose Province</h4>
                                    <MultiSelect
                                        options={provinceOptions.map(
                                            (province) => ({
                                                label: province,
                                                value: province,
                                            })
                                        )}
                                        labelledBy="Choose Province"
                                        value={province}
                                        placeholder="Please select your destination provinces."
                                        onChange={setProvince}
                                    />
                                    <h4 className="ps-3">Choose Country</h4>
                                    <MultiSelect
                                        options={countryOptions.map(
                                            (country) => ({
                                                label: country,
                                                value: country,
                                            })
                                        )}
                                        value={country}
                                        labelledBy="Choose Country"
                                        placeholder="Please select your destination countries."
                                        onChange={setCountry}
                                    />
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <div className="h3 text-left">
                                            Number of Guests
                                        </div>
                                        <input
                                            className="form-control w-100"
                                            type="number"
                                            min="1"
                                            max="10"
                                            placeholder="Enter guest number..."
                                            onChange={(e) =>
                                                setGuestMin(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <div className="h3 text-left">
                                            Amenities
                                        </div>
                                        <MultiSelect
                                            key={amenitiesChoices}
                                            options={amenitiesChoices}
                                            value={amenities}
                                            labelledBy="Choose Amenities"
                                            onChange={setAmenities}
                                        />
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            onClick={(e) => {
                                                setFilters({
                                                    ...filters,
                                                    city: city.map(
                                                        (city) => city.value
                                                    ),
                                                    province: province.map(
                                                        (province) =>
                                                            province.value
                                                    ),
                                                    country: country.map(
                                                        (country) =>
                                                            country.value
                                                    ),
                                                    amenities: amenities.map(
                                                        (amenity) =>
                                                            amenity.value
                                                    ),
                                                    price_max: maxPrice,
                                                    price_min: minPrice,
                                                    max_guests_min: guestMin,
                                                    available_date_after:
                                                        startDate &&
                                                        new moment(
                                                            startDate
                                                        ).format('YYYY-MM-DD'),
                                                    available_date_before:
                                                        endDate &&
                                                        new moment(
                                                            endDate
                                                        ).format('YYYY-MM-DD'),
                                                });
                                                setOrderBy(thisOrderBy);
                                                setShowFilter(false);
                                                setIsLoading(true);
                                                setNext(initialNext);
                                            }}
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FilterForm;
