from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class Review(models.Model):
    """Review model

    Fields:
        review (TextField): Review text
        accuracy (PositiveIntegerField): Accuracy rating
        communication (PositiveIntegerField): Communication rating
        cleanliness (PositiveIntegerField): Cleanliness rating
        location (PositiveIntegerField): Location rating
        check_in (PositiveIntegerField): Check-in rating
        value (PositiveIntegerField): Value rating
        reviewer (ForeignKey): Reviewer
        
    """
    review = models.TextField(blank=True)
    accuracy = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    communication = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    cleanliness = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    location = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    check_in = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    value = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    reviewer = models.ForeignKey('accounts.User', related_name="reviews", on_delete=models.SET_NULL, null=True)
    property = models.ForeignKey('property.Property', related_name="reviews", on_delete=models.SET_NULL, null=True)
    reservation = models.ForeignKey('reservations.Reservations', related_name="reviews", on_delete=models.SET_NULL, null=True)
    
    to_guest = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('reviewer', 'reservation')
        ordering = ('-created_at',)
    
    def __str__(self):
        return f"id:{self.id} {self.review} - {self.reviewer}"

    def rating_average(self):
        average = (
            self.accuracy
            + self.communication
            + self.cleanliness
            + self.location
            + self.check_in
            + self.value
        ) / 6

        return round(average, 2)
    

class Response(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='responses')
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='responses')
    reply = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('created_at',)
    