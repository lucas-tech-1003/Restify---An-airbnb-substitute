from rest_framework import serializers
from django_countries.serializers import CountryFieldMixin

from .models import Property, Photo
from accounts.serializers import UserSerializer

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = "__all__"


class PropertySerializer(CountryFieldMixin, serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    photos = PhotoSerializer(many=True, read_only=True)
    uploaded_photos = serializers.ListField(
        child = serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False), 
        write_only=True)
    
    amenities = serializers.MultipleChoiceField(choices=Property.AMENITIES_CHOICES, allow_blank=True)
    
    num_reviews = serializers.SerializerMethodField()
    class Meta:
        model = Property
        fields = "__all__"
        read_only_fields = (
            "host",
            "created_at",
            "modified_at",
            "id",
            "rating",
        )
        
    def to_representation(self, instance):
        instance.rating = instance.get_rating()
        instance.save()
        ret = super().to_representation(instance)
        return ret
    
    def validate(self, data):
        """Check the start_available_date is before end_available_date"""
        start_available_date = data.get("start_available_date")
        end_available_date = data.get("end_available_date")
        if not self.instance: # this means we are creating the instance
            if not start_available_date:
                raise serializers.ValidationError("You must provide a start date")
            if start_available_date and end_available_date and start_available_date >= end_available_date:
                raise serializers.ValidationError("The start date must be before the end date")
        else:
            if start_available_date and end_available_date and start_available_date >= end_available_date:
                raise serializers.ValidationError("The start date must be before the end date")
            if start_available_date and not end_available_date:
                end_available_date = self.instance.end_available_date
                if end_available_date is not None and start_available_date >= end_available_date:
                    raise serializers.ValidationError("The start date must be before the end date")
            elif not start_available_date and end_available_date:
                start_available_date = self.instance.start_available_date
                if start_available_date >= end_available_date:
                    raise serializers.ValidationError("The start date must be before the end date")
            
        return data

    def create(self, validated_data):
        request = self.context.get("request")
        uploaded_photos = validated_data.pop("uploaded_photos")
        property = Property.objects.create(**validated_data, host=request.user)
        for photo in uploaded_photos:
            new_photo = Photo.objects.create(file=photo, property=property)
        return property
    
    def get_num_reviews(self, obj):
        return obj.reviews.filter(to_guest=False).count()
    
    