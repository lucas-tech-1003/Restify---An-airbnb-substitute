from django.urls import path
from .views import (ReservationsUserList, ReservationsHostList,ReservationCreateAPIView,ReservationsDetailAPIView,
                    UserReservationCancelAPIView,HostReservationApprovedAPIView,HostReservationTerminateAPIView,
                    HostReservationApprovedCancelAPIView,HostReservationsDetailAPIView,HostReservationDeniedAPIView,HostReservationDeniedCancelAPIView,
                    HostReservationCompleteAPIView)
app_name = 'reservations'
urlpatterns = [
    path("", ReservationsUserList.as_view(), name="reservations-list"),
    path("host/", ReservationsHostList.as_view(), name="reservations-hostlist"),
    path("<int:pk>/view/", ReservationsDetailAPIView.as_view(), name="reservation-detail"),
    path("host/<int:pk>/view/", HostReservationsDetailAPIView.as_view(), name="reservation-detail"),
    path("<int:pk>/cancel/", UserReservationCancelAPIView.as_view(), name="reservation-cancel"),
    path("host/<int:pk>/approved/", HostReservationApprovedAPIView.as_view(), name="reservation-approved"),
    path("host/<int:pk>/approvedcancel/", HostReservationApprovedCancelAPIView.as_view(), name="reservation-approvedcancel"),
    path("host/<int:pk>/terminate/", HostReservationTerminateAPIView.as_view(), name="reservation-terminate"),
    path("host/<int:pk>/deniedcancel/", HostReservationDeniedCancelAPIView.as_view(), name="reservation-deniedcancel"),
    path("host/<int:pk>/denied/", HostReservationDeniedAPIView.as_view(), name="reservation-denied"),
    path("host/<int:pk>/complete/", HostReservationCompleteAPIView.as_view(), name="reservation-complete"),
]