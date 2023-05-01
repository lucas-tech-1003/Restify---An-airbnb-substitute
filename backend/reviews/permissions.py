from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404

from property.models import Property
from reservations.models import Reservations


class IsReviewerOrIsOwner(BasePermission):
    message = "Not the reviewer or owner of the property."
    
    def has_object_permission(self, request, view, review):
        return review.property.host == request.user or review.reviewer == request.user


class IsReviewAuthor(BasePermission):
    message = "Not the reviewer of the review."
    
    def has_object_permission(self, request, view, review):
        return review.reviewer == request.user
    

class IsReplyAuthor(BasePermission):
    message = "Not the reply author."
    
    def has_object_permission(self, request, view, response):
        return response.user == request.user
    

class IsNotHostAndHasReservationPermission(BasePermission):

    def has_permission(self, request, view):
        pk = view.kwargs.get('pk')
        property = get_object_or_404(Property, pk=pk)
        
        # Check if user is not the host of the property
        if property.host == request.user:
            self.message = "You are not allowed to create a review for your own property."
            return False
        
        # Check if user has completed or terminated reservations with the property
        reservations = Reservations.objects.filter(property=property, reserved_by=request.user, status__in=['completed', 'terminated'])
        if not reservations:
            self.message = 'You have not completed or terminated reservations with this property.'
            return False
        
        return True
        