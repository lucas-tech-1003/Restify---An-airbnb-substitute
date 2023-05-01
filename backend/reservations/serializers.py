from rest_framework import serializers
from .models import Reservations
from property.models import Property
from rest_framework.serializers import ModelSerializer
from notifications.models import Notification
class ReservationsSerializer(ModelSerializer):

    class Meta:
        model = Reservations
        fields = ['id','reserved_by', 'property','number_guests','start_date','end_date','status']
        read_only_fields = ['status','reserved_by', 'property']

    def create(self, validated_data):
        request = self.context.get("request")
        property_id = self.context['view'].kwargs.get('pk')
        
        try:
            property = Property.objects.get(pk=property_id)
        except Property.DoesNotExist:
            raise serializers.ValidationError("Property does not exist")
        validated_data['property'] = property
        if validated_data['number_guests'] > property.max_guests:
            raise serializers.ValidationError("Exceeds the maximum number of guests allowed.")
        queryset = Reservations.objects.filter(property=property, status__in=['approved', 'pending_cancel'])
        queryset1 = queryset.filter(start_date__gt=validated_data['start_date'], 
                                           end_date__lt=validated_data['end_date'])
        if queryset1.exists():
            raise serializers.ValidationError("There are reservation conflicts for this property")
        reservation = Reservations.objects.create(**validated_data, reserved_by=request.user)
        
        # add Notification to host
        msg = "You have a new reservation request for your property *{}*.".format(property.title)
        Notification.objects.create(receiver=property.host, message=msg)
        return reservation
            
