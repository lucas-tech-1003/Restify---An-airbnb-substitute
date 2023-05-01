from django.urls import path

from .views import NotificationsListAPIView, NotificationDetailAPIView

app_name = 'notifications'
urlpatterns = [
    path('', NotificationsListAPIView.as_view(), name='notification-list'),
    path('<int:pk>/', NotificationDetailAPIView.as_view(), name='notification-read')
]
