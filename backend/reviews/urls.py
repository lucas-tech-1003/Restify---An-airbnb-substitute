from django.urls import path

from .views import (ReviewListAPIView, ResponseListCreateAPIView, ReviewCreateAPIView,
                    ReviewGetPutDeleteAPIView, ResponseGetPutDeleteAPIView,
                    ReviewToGuestCreateAPIView)

app_name = 'reviews'
urlpatterns = [
    path('', ReviewListAPIView.as_view(), name='review-list'),
    path('<int:reservation_id>/addreview/', ReviewCreateAPIView.as_view(), name='review-create-property'),
    path('<int:reservation_id>/reviewguest/', ReviewToGuestCreateAPIView.as_view(), name='review-create-guest'),
    path('<int:review_id>/edit/', ReviewGetPutDeleteAPIView.as_view(), name='review-get-put-delete'),
    path('<int:review_id>/reply/', ResponseListCreateAPIView.as_view(), name='response-list-create'),
    path('<int:review_id>/<int:response_id>/edit/', ResponseGetPutDeleteAPIView.as_view(), name='response-get-put-delete'),
]