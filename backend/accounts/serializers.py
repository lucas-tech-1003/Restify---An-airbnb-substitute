from rest_framework import serializers
from .models import User
from reviews.models import Review
from reviews.serializers import ReviewSerializer, ReviewToGuestSerializer


class UserSerializer(serializers.ModelSerializer):
    num_reviews = serializers.SerializerMethodField(read_only=True)
    reviews_from_guest = serializers.SerializerMethodField(read_only=True)
    reviews_from_host = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = (
            "id",
            "avatar",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone",
            "password",
            'num_reviews',
            'reviews_from_guest',
            'reviews_from_host',
        )
        extra_kwargs = {'password': {'write_only': True}}
        read_only_fields = ('id', 'num_reviews',)
        
    def get_num_reviews(self, obj):
        return Review.objects.filter(property__host=obj, to_guest=False).count() \
            + Review.objects.filter(reservation__reserved_by=obj, to_guest=True).count()

    def get_reviews_from_guest(self, obj):
        reviews = ReviewSerializer(
            Review.objects.filter(property__host=obj, to_guest=False), many=True)
        return reviews.data
    
    def get_reviews_from_host(self, obj):
        reviews = ReviewSerializer(
            Review.objects.filter(reservation__reserved_by=obj, to_guest=True), many=True)
        return reviews.data

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = self.Meta.model(**validated_data)
        if password is not None:
            user.set_password(password)
        user.save()
        return user