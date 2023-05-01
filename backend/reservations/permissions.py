from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404
from property.models import Property

class IsUserPermission(BasePermission):
    # message = {"code":00,"data":""}
    message = "You cannot make a reservation for your own property."
    def has_permission(self, request, view):
        property = get_object_or_404(Property, pk=view.kwargs.get('pk'))
        return property.host != request.user

class DatePermission(BasePermission):
    def has_object_permission(self, request, view, reservation):
        if reservation.start_date >= reservation.property.start_available_date and (reservation.end_date <= reservation.property.end_available_date or reservation.property.end_available_date == "null"): 
            return True
        else:
            return False
        
class HostUserPermission(BasePermission):
    # message = {"code":00,"data":""}
    message = "You are not the host of this property or have reserved this property."
    def has_object_permission(self, request, view,reservation):
        return reservation.property.host == request.user or \
                reservation.reserved_by == request.user
        
class ApprovedPermission(BasePermission):
    message = "The status of the reservation is not approved."
    def has_object_permission(self, request, view, reservation):
        if reservation.status == "approved":
            return True
        return False
    
class PendingPermission(BasePermission):
    message = "The status of the reservations is not pending."
    def has_object_permission(self, request, view, reservation):
        if reservation.status == "pending":
            return True
        return False
    
class ApprovedcancelPermission(BasePermission):
    message = "The status is not pending_cancel."

    def has_object_permission(self, request, view, reservation):
        if reservation.status == "pending_cancel":
            return True
        return False