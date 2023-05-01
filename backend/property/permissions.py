from rest_framework.permissions import BasePermission

class IsOwner(BasePermission):
    message = "You are not the owner of this property."
    
    def has_object_permission(self, request, view, property):
        return property.host == request.user