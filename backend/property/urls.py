from django.urls import path, include
from .views import (PropertyListAPIView, PropertyDetailAPIView, 
                    PropertyHostListCreateAPIView, PropertyGetPutDeleteAPIView)
from .views import GetCities, GetCountries, GetProvinces
from reservations.views import ReservationCreateAPIView
app_name = 'properties'
urlpatterns = [
    path("", PropertyListAPIView.as_view(), name="property-list"),
    path("<int:pk>/view/", PropertyDetailAPIView.as_view(), name="property-detail"),
    path("host/listings/", PropertyHostListCreateAPIView.as_view(), name="property-host-list-create"),
    path("host/listings/<int:pk>/edit/", PropertyGetPutDeleteAPIView.as_view(), name="property-get-put-delete"),
    path("<int:pk>/reviews/", include("reviews.urls", namespace="reviews")),
    path("<int:pk>/view/reserve/", ReservationCreateAPIView.as_view(), name="reservation-create"),
    path("cities/", GetCities.as_view(), name="get-cities"),
    path("countries/", GetCountries.as_view(), name="get-countries"),
    path("provinces/", GetProvinces.as_view(), name="get-provinces"),
]