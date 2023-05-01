import React, { useState, useEffect } from 'react';

import FilterForm from './FilterForm';
import PropertyList from '../PropertyList/PropertyList';

import './style.css';
import { Divider, Loader, Button } from 'rsuite';

const SearchPresenter = ({
    query,
    setQuery,
    results,
    filters,
    setFilters,
    orderBy,
    setOrderBy,
    cityOptions,
    provinceOptions,
    countryOptions,
    amenitiesChoices,
    handleSearch,
    isLoading,
    setIsLoading,
    isHosting,
    canEdit=false,
}) => {
    const token = localStorage.getItem('access') || null;
    const properties = results.results;
    const initialNext = results.next;
    const [next, setNext] = useState('');

    useEffect(() => {
        setNext(results.next);
    }, [results.next]);

    const handleLoadMore = () => {
        console.log('load more');
        console.log('next', next);
        if (!isHosting) {
            fetch(next)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    properties.push(...data.results);
                    setNext(data.next);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        } else {
            fetch(next, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    properties.push(...data.results);
                    setNext(data.next);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    };

    return (
        <>
            <div className="container-fluid pt-5">
                <div
                    className="container text-center border-pink"
                    id="searchBox"
                >
                    <div className="search-container">
                        <form onSubmit={handleSearch}>
                            <input
                                className="form col-xs-9 form-control-lg w-50"
                                type="text"
                                placeholder="Search.."
                                value={query}
                                name="search"
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                }}
                            />
                            <button
                                type="submit"
                                className="btn btn-danger btn-lg mb-2 ms-1"
                            >
                                Search
                            </button>
                            <Divider vertical />
                            <FilterForm
                                setQuery={setQuery}
                                filters={filters}
                                setFilters={setFilters}
                                orderBy={orderBy}
                                setOrderBy={setOrderBy}
                                cityOptions={cityOptions}
                                provinceOptions={provinceOptions}
                                countryOptions={countryOptions}
                                amenitiesChoices={amenitiesChoices}
                                handleSearch={handleSearch}
                                setIsLoading={setIsLoading}
                                setNext={setNext}
                                initialNext={initialNext}
                            />
                        </form>
                    </div>
                </div>
            </div>
            <div className="container-fluid p-2 bg-light border border-warning border-2 rounded">
                {isLoading ? (
                    <Loader center size="lg" speed="slow">
                        Loading...
                    </Loader>
                ) : (
                    <>
                        <div className="row p-2">
                            <PropertyList properties={properties} canEdit={canEdit} />
                        </div>
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
                    </>
                )}
            </div>
        </>
    );
};

export default SearchPresenter;
