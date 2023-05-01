import React from "react";

import PropertyCard from "../PropertyCard/PropertyCard";


const PropertyList = ( {properties, carouselAutoPlay = false,
    carouselShape = 'dot', canEdit=false} ) => {
    return properties ? properties.map((property) => (
        <PropertyCard
            id={property.id}
            photos={property.photos}
            city={property.city}
            country={property.country}
            rating={property.rating}
            numberReviews={property.num_reviews}
            price={property.price}
            carouselAutoPlay={carouselAutoPlay}
            carouselShape={carouselShape}
            canEdit={canEdit}
        />
    )) : <></>;
}

export default PropertyList;