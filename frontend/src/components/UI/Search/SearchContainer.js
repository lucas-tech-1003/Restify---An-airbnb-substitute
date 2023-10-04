import React, { useEffect, useState } from 'react';

import SearchPresenter from './SearchPresenter';

const SearchComponent = ({isHosting=false, canEdit=false}) => {
    const token = localStorage.getItem('access') || null;

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [filters, setFilters] = useState({
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
    const [orderBy, setOrderBy] = useState('');
    const [cityOptions, setCityOptions] = useState([]);
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const fetchCityOptions = () => {
        fetch('http://127.0.0.1:8000/properties/cities/')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setCityOptions(data);
            });
    };

    const fetchProvinceOptions = () => {
        fetch(`http://127.0.0.1:8000/properties/provinces/`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setProvinceOptions(data);
            });
    };

    const fetchCountryOptions = () => {
        fetch(`http://127.0.0.1:8000/properties/countries/`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setCountryOptions(data);
            });
    };

    const fetchInitialProperities = () => {
        const hostPath = isHosting ? 'host/listings/' : ''
        const baseurl = `http://localhost:8000/properties/${hostPath}`;
        fetch(baseurl, {headers: {'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json'}})
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setResults(data);
            });
    };

    useEffect(() => {
        fetchCityOptions();
        fetchProvinceOptions();
        fetchCountryOptions();
        fetchInitialProperities();
    }, []);

    useEffect(() => {
        handleSearch({ preventDefault: () => {} });
    }, [filters, orderBy]);

    const handleSearch = (e) => {
        e.preventDefault();
        const amenitiesQueryString = filters.amenities
            ? filters.amenities
                  .map((amenity) => `&amenities=${amenity}`)
                  .join('')
            : '';
        const cityQueryString = filters.city
            ? filters.city.map((city) => `&city=${city}`).join('')
            : '';
        const provinceQueryString = filters.province
            ? filters.province
                  .map((province) => `&province=${province}`)
                  .join('')
            : '';
        const countryQueryString = filters.country
            ? filters.country.map((country) => `&country=${country}`).join('')
            : '';
        const hostPath = isHosting ? 'host/listings/' : ''
        const baseurl = `http://localhost:8000/properties/${hostPath}`;
        const filterQueryString = `${cityQueryString}${provinceQueryString}${countryQueryString}${amenitiesQueryString}`;
        const { city, province, country, amenities, ...rest } = filters;
        const filterQueryString2 = `&${Object.keys(rest)
            .map((key) => `${key}=${rest[key]}`)
            .join('&')}`;
        const orderingQueryString = `&ordering=${orderBy}`;

        const url = `${baseurl}?search=${query}${filterQueryString}${filterQueryString2}${orderingQueryString}`;
        if (!isHosting) {
            fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setResults(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
        } else {
            fetch(url, {headers: {'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json'}})
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setResults(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
        }
        
    };

    return (
        <SearchPresenter
            query={query}
            setQuery={setQuery}
            results={results}
            filters={filters}
            setFilters={setFilters}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            cityOptions={cityOptions}
            provinceOptions={provinceOptions}
            countryOptions={countryOptions}
            amenitiesChoices={amenitiesChoices}
            handleSearch={handleSearch}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            isHosting={isHosting}
            canEdit={canEdit}
        />
    );
};

export default SearchComponent;
