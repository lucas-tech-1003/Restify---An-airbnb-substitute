from django.shortcuts import render
from .models import Reservations
from .serializers import ReservationsSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import CreateAPIView, ListAPIView,RetrieveAPIView,UpdateAPIView
# Create your views here.
from notifications.models import Notification
from rest_framework.permissions import IsAuthenticated
from .permissions import IsUserPermission, DatePermission,HostUserPermission,ApprovedPermission,PendingPermission,ApprovedcancelPermission
class ReservationsUserList(ListAPIView):
    permission_classes = [IsAuthenticated,HostUserPermission]
    serializer_class = ReservationsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']
    def get_queryset(self):
        user = self.request.user
        queryset = Reservations.objects.filter(reserved_by=user)
        return queryset


class ReservationsHostList(ListAPIView):
    permission_classes = [IsAuthenticated,HostUserPermission]
    serializer_class = ReservationsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']
 
    def get_queryset(self):
        user = self.request.user
        queryset = Reservations.objects.filter(property__host=user )
        return queryset
        

class ReservationsDetailAPIView(RetrieveAPIView):
    queryset = Reservations.objects.all()
    serializer_class = ReservationsSerializer
    permission_classes = (IsAuthenticated,HostUserPermission)

class HostReservationsDetailAPIView(RetrieveAPIView):
    queryset = Reservations.objects.all()
    serializer_class = ReservationsSerializer
    permission_classes = (IsAuthenticated,HostUserPermission)

class ReservationCreateAPIView(CreateAPIView):
    queryset = Reservations.objects.all()
    serializer_class = ReservationsSerializer
    permission_classes = (IsAuthenticated, IsUserPermission, DatePermission)


class UserReservationCancelAPIView(UpdateAPIView):
    queryset = Reservations.objects.all()
    serializer_class = ReservationsSerializer
    permission_classes = (IsAuthenticated, HostUserPermission, ApprovedPermission)

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.status = "pending_cancel"
        serializer.save()
        # add notification to host
        msg = f"{instance.reserved_by.first_name} has requested to cancel the reservation for property {instance.property.title}."
        Notification.objects.create(receiver=instance.property.host, message=msg)
  
    
class HostReservationApprovedAPIView(UpdateAPIView):
    queryset = Reservations.objects.all()
    serializer_class = ReservationsSerializer
    permission_classes = (IsAuthenticated,HostUserPermission,PendingPermission )

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.status = "approved"
        serializer.save()
        # add notification to reserved_by
        msg = f"Host {instance.property.host.first_name} has approved your reservation for {instance.property.title}."
        Notification.objects.create(receiver=instance.reserved_by, message=msg)
    

class HostReservationApprovedCancelAPIView(UpdateAPIView):
    queryset = Reservations.objects.all()
    serializer_class = ReservationsSerializer
    permission_classes = (IsAuthenticated,HostUserPermission,ApprovedcancelPermission)
    # lookup_field = 'id'
    def perform_update(self, serializer):
        instance = serializer.save()
        instance.status = "canceled"
        serializer.save()
        # add notification to reserved_by
        msg = f"Host {instance.property.host.first_name} has canceled your reservation for {instance.property.title}."
        Notification.objects.create(receiver=instance.reserved_by, message=msg)
   
    
class HostReservationTerminateAPIView(UpdateAPIView):
    queryset = Reservations.objects.all()
    serializer_class = ReservationsSerializer
    permission_classes = (IsAuthenticated,HostUserPermission, ApprovedPermission,)

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.status = "terminated"
        serializer.save()
        # add notification to reserved_by
        msg = f"Host {instance.property.host.first_name} has terminated your reservation for {instance.property.title}."
        Notification.objects.create(receiver=instance.reserved_by, message=msg)
    
class HostReservationDeniedAPIView(UpdateAPIView):
    queryset = Reservations.objects.all()
    serializer_class = ReservationsSerializer
    permission_classes = (IsAuthenticated,HostUserPermission,PendingPermission )
    
    def perform_update(self, serializer):
        instance = serializer.save()
        instance.status = "denied"
        serializer.save()
        # add notification to reserved_by
        msg = f"Host {instance.property.host.first_name} has denied your reservation for {instance.property.title}."
        Notification.objects.create(receiver=instance.reserved_by, message=msg)
    
class HostReservationDeniedCancelAPIView(UpdateAPIView):
    queryset = Reservations.objects.all()
    serializer_class = ReservationsSerializer
    permission_classes = (IsAuthenticated,HostUserPermission,ApprovedcancelPermission )

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.status = "approved"
        serializer.save()
        # add notification to reserved_by
        msg = f"Host {instance.property.host.first_name} has denied your cancel request for {instance.property.title}."
        Notification.objects.create(receiver=instance.reserved_by, message=msg)

class HostReservationCompleteAPIView(UpdateAPIView):
    queryset = Reservations.objects.all()
    serializer_class = ReservationsSerializer
    permission_classes = (IsAuthenticated,HostUserPermission)

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.status = "completed"
        serializer.save()
        # add notification to reserved_by
        msg = f"Host {instance.property.host.first_name} has completed your reservation for {instance.property.title}."
        Notification.objects.create(receiver=instance.reserved_by, message=msg)
    