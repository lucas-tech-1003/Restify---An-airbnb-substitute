from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, LogoutView, UserProfileView, OtherUserProfileView


app_name = 'accounts'
urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='login_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='log_out'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/<int:pk>/', OtherUserProfileView.as_view(), name='other_profile')
]
