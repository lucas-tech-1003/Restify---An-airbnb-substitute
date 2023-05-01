from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from .filters import PropertyFilter
from .permissions import IsOwner
from reservations.views import ReservationCreateAPIView


from .models import Property, Photo
from .serializers import PropertySerializer


class GetCities(APIView):
    def get(self, request):
        cities = Property.objects.values_list('city', flat=True).distinct()
        return Response(cities)
    

class GetCountries(APIView):
    def get(self, request):
        countries = Property.objects.values_list('country', flat=True).distinct()
        return Response(countries)


class GetProvinces(APIView):
    def get(self, request):
        provinces = Property.objects.values_list('province', flat=True).distinct()
        return Response(provinces)

# Create your views here.
class PropertyListAPIView(ListAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = (AllowAny,)
    filter_backends = [SearchFilter, DjangoFilterBackend, OrderingFilter]
    search_fields = ['title', 'city', 'country', 'content', 'street',]
    filterset_class = PropertyFilter
    ordering_fields = ['price', 'rating',]
    ordering = ['price']
    pagination_class = PageNumberPagination
    pagination_class.page_size = 4  # set the page size to 5
    

class PropertyHostListCreateAPIView(PropertyListAPIView, CreateAPIView):
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        return Property.objects.filter(host=self.request.user)


class PropertyDetailAPIView(RetrieveAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = (AllowAny,)


class PropertyGetPutDeleteAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = (IsAuthenticated, IsOwner,)
    
    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    