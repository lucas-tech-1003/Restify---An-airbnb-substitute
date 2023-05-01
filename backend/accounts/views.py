from django.shortcuts import render
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import RetrieveUpdateAPIView, RetrieveAPIView
from django.shortcuts import get_object_or_404

# Create your views here.
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    
# class LoginView(APIView):
#     def post(self, request):
#         username = request.data['username']
#         password = request.data['password']

#         # Check if user exists
#         user = User.objects.filter(username=username).first()
#         if user is None:
#             raise AuthenticationFailed('User not found!')
        
#         # Check if password is correct
#         if not user.check_password(password):
#             raise AuthenticationFailed('Incorrect password!')
        
#         payload = {
#             'id': user.id,
#             'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
#             'iat': datetime.datetime.utcnow()
#         }

#         token = jwt.encode(payload, 'secret', algorithm='HS256')

#         response = Response()
#         response.set_cookie(key='jwt', value=token, httponly=True)
#         response.data = {
#             'jwt': token
#         }
        
#         return response
    

class UserView(APIView):
    def get(self, request):
        # token = request.COOKIES.get('jwt')

        # if not token:
        #     raise AuthenticationFailed('Unauthenticated!')

        # try:
        #     payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        # except jwt.ExpiredSignatureError:
        #     raise AuthenticationFailed('Unauthenticated!')
        
        user = User.objects.filter(id=request.user.id).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)
    

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({'success': 'User logged out successfully.'}, status=200)
        except Exception as e:
            return Response({'error': 'Token is invalid or expired'}, status=400)
        
class UserProfileView(RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, ]

    def get_object(self):
        return get_object_or_404(User, pk=self.request.user.id)

    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

class OtherUserProfileView(RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny, ]

    def get_object(self):
        return get_object_or_404(User, pk=self.kwargs['pk'])
