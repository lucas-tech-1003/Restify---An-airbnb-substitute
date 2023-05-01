from rest_framework import serializers

from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Notification
        exclude = ['receiver']
        read_only_fields = ['id',
                            'created_at',
                            'message']
        
    def create(self, validated_data):
        return Notification.objects.create(**validated_data)