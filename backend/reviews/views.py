from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination


from .models import Review, Response
from property.models import Property
from .serializers import ReviewSerializer, ResponseSerializer, ReviewToGuestSerializer
from .permissions import IsReviewerOrIsOwner, IsReplyAuthor, IsReviewAuthor, IsNotHostAndHasReservationPermission

# Create your views here.
class ReviewListAPIView(ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny,]
    pagination_class = PageNumberPagination
    pagination_class.page_size = 2  # set the page size to 5
    
    def get_queryset(self):
        property_id = self.kwargs.get('pk')
        property = get_object_or_404(Property, pk=property_id)
        return Review.objects.filter(property=property, to_guest=False)
    
    
class ReviewCreateAPIView(CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated, IsNotHostAndHasReservationPermission]
    

class ReviewToGuestCreateAPIView(CreateAPIView):
    serializer_class = ReviewToGuestSerializer
    permission_classes = [IsAuthenticated]
    

class ReviewGetPutDeleteAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsReviewAuthor]
    
    def put(self, request, *args, **kwargs):
        self.kwargs['pk'] = self.kwargs['review_id']
        return self.partial_update(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        self.kwargs['pk'] = self.kwargs['review_id']
        return self.retrieve(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        self.kwargs['pk'] = self.kwargs['review_id']
        return self.destroy(request, *args, **kwargs)
    

# class ReviewFromGuestListAPIView(ListAPIView):
#     serializer_class = ReviewSerializer
#     permission_classes = [AllowAny,]
    
#     class Meta:
#         model = Review
#         ordering = ['-created_at'] # Add this line to order by created_at in descending order
    
#     def get_queryset(self):
#         """Return a list of all the reviews from the guests 
#         that had reserved the property of the request.user and the 
#         reservations are completed or terminated.
#         """
#         user = self.kwargs['id']
#         return Review.objects.filter(property__host=self.request.user, to_guest=False)
    
    
# class ReviewFromHostListAPIView(ReviewFromGuestListAPIView):
#     def get_queryset(self):
#         """Return a list of all the reviews from the hosts 
#         that the user had reservations completed or terminated.
#         """
#         return Review.objects.filter(reservation__reserved_by=self.request.user, to_guest=True)
    

class ResponseListCreateAPIView(ListCreateAPIView):
    queryset = Response.objects.all()
    serializer_class = ResponseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsReviewerOrIsOwner]
    

class ResponseGetPutDeleteAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Response.objects.all()
    serializer_class = ResponseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsReplyAuthor]
    lookup_field = 'id'
    
    def put(self, request, *args, **kwargs):
        self.kwargs['id'] = self.kwargs['response_id']
        return self.partial_update(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        self.kwargs['id'] = self.kwargs['response_id']
        return self.retrieve(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        self.kwargs['id'] = self.kwargs['response_id']
        return self.destroy(request, *args, **kwargs)

