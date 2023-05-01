from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from .serializers import NotificationSerializer
from .permissions import IsReceiver
from .models import Notification
# Create your views here.
class NotificationsListAPIView(ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated,]
    
    def get_queryset(self):
        # Filter read and unread notifications separately
        read_notifications = Notification.objects.filter(receiver=self.request.user, is_read=True)
        unread_notifications = Notification.objects.filter(receiver=self.request.user, is_read=False)
        
        # Delete read notifications
        read_notifications.delete()
        
        # Return unread notifications
        return unread_notifications
    

class NotificationDetailAPIView(RetrieveAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated, IsReceiver]

    def get(self, request, *args, **kwargs):
        # Update unread notifications to be read
        instance = self.get_object()
        if instance.is_read: # delete read notification
            instance.delete()
            return super().get(request, *args, **kwargs)
        instance.is_read = True
        instance.save()
        return super().get(request, *args, **kwargs)