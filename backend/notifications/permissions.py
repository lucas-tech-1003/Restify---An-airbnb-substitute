from rest_framework.permissions import BasePermission

class IsReceiver(BasePermission):
    message = "You don't have permission to view this notification."
    
    def has_object_permission(self, request, view, notification):
        return notification.receiver == request.user