from sqlite3 import IntegrityError
from rest_framework import serializers

from .models import Review, Response
from property.models import Property
from reservations.models import Reservations
from notifications.models import Notification

class ResponseSerializer(serializers.ModelSerializer):
    # avatar = serializers.ReadOnlyField(source='user.avatar')
    # first_name = serializers.ReadOnlyField(source='user.first_name')
    class Meta:
        model = Response
        fields = ('id', 'review', 'user', 'reply', 'created_at',)
        read_only_fields = [
            'id',
            'review', 
            'user', 
            'created_at',
            ]
        
    def create(self, validated_data):
        request = self.context.get('request')
        review_id = self.context['view'].kwargs.get('review_id')
        try:
            review = Review.objects.get(pk=review_id)
        except Review.DoesNotExist:
            raise serializers.ValidationError("Review does not exist")
        validated_data['review'] = review
        
        response = Response.objects.create(**validated_data, user=request.user)
        # Add notification
        if request.user == review.reservation.reserved_by:
            # Guest replied to review
            msg = f'Guest {request.user.username} has replied to the review for *{review.property.title}*.'
            Notification.objects.create(receiver=review.property.host, message=msg)
        else:
            # Host replied to review
            msg = f'Host {request.user.username} has replied to the review for *{review.property.title}*.'
            Notification.objects.create(receiver=review.reservation.reserved_by, message=msg)
        return response


class ReviewSerializer(serializers.ModelSerializer):
    # first_name = serializers.ReadOnlyField(source='reviewer.first_name')
    # avatar = serializers.ReadOnlyField(source='reviewer.avatar')
    responses = ResponseSerializer(many=True, read_only=True)
    class Meta:
        model = Review
        fields = "__all__"
        # exclude = ["reservation"]
        read_only_fields = [
            "id",
            "property", 
            "reviewer", 
            "created_at",
            "reservation",
            "to_guest",
            'first_name',
            'avatar',]

    def create(self, validated_data):
        request = self.context.get("request")
        pk = self.context['view'].kwargs.get('pk')
        reservation_id = self.context['view'].kwargs.get('reservation_id')
        try:
            reservation = Reservations.objects.get(pk=reservation_id)
        except Reservations.DoesNotExist:
            raise serializers.ValidationError("Reservation does not exist")
        try:
            property = Property.objects.get(pk=pk)
        except Property.DoesNotExist:
            raise serializers.ValidationError("Property does not exist")
        validated_data['reservation'] = reservation
        validated_data['property'] = property
        if reservation.property != property:
            raise serializers.ValidationError("Reservation is not for this property")
            
        # Check if user has completed or terminated reservations with the property or is the host
        if reservation.reserved_by != request.user:
            raise serializers.ValidationError("You are not allowed to review this property. Only guests can leave a review.")
        
        if reservation.status not in ['completed', 'terminated']:
            raise serializers.ValidationError("Reservation is not completed or terminated")
        
        try:
            review = Review.objects.create(**validated_data, reviewer=request.user)
        except:
            raise serializers.ValidationError("You have already reviewed this property.")
        
        # Add notification to the host
        msg = f"The guest {request.user.username} has left a review for your property *{property.title}*."
        Notification.objects.create(receiver=property.host, message=msg)
        
        return review


class ReviewToGuestSerializer(serializers.Serializer):
    # first_name = serializers.ReadOnlyField(source='reviewer.first_name')
    # avatar = serializers.ReadOnlyField(source='reviewer.avatar')
    review = serializers.CharField(required=True, max_length=500)
    class Meta:
        model = Review
        fields = ['id', 'property', 'reviewer', 'review', 'created_at', 'reservation', 'to_guest']
        read_only_fields = [
            'id',
            "property", 
            "reviewer", 
            "created_at",
            "reservation",
            "to_guest",
            ]
        
    def create(self, validated_data):
        request = self.context.get("request")
        pk = self.context['view'].kwargs.get('pk')
        reservation_id = self.context['view'].kwargs.get('reservation_id')
        try:
            reservation = Reservations.objects.get(pk=reservation_id)
        except Reservations.DoesNotExist:
            raise serializers.ValidationError("Reservation does not exist")
        try:
            property = Property.objects.get(pk=pk)
        except Property.DoesNotExist:
            raise serializers.ValidationError("Property does not exist")
        validated_data['reservation'] = reservation
        validated_data['property'] = property
        if reservation.property != property:
            raise serializers.ValidationError("Reservation does not belong to this property.")
        
        if request.user != property.host:
            raise serializers.ValidationError("You are not allowed to review the guest. Only hosts can leave a review.")
        if reservation.status != 'completed':
            raise serializers.ValidationError(f"Reservation is not completed. The host can only "
                                                f"add review to the guest after the reservation is completed.")
        try:
            review = Review.objects.create(**validated_data, reviewer=request.user, to_guest=True, 
                                        accuracy=1, communication=1, cleanliness=1, location=1, check_in=1, value=1)
        except:
            raise serializers.ValidationError("You have already reviewed this user for this reservation.")

        # Add notification to the guest
        msg = f"The host {request.user.username} has left a review for your reservation at *{property.title}*."
        Notification.objects.create(receiver=reservation.reserved_by, message=msg)
        
        return review

