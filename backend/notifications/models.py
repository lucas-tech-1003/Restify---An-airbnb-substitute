from django.db import models

# Create your models here.
class Notification(models.Model):
    message = models.CharField(max_length=255)
    receiver = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='notifications')
    is_read = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ('-created_at',)
    
    def __str__(self):
        return f"id: {self.id} {self.receiver.username} {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}"