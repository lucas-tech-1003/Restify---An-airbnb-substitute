from django.db import models

# Create your models here.
class Reservations(models.Model):
    property = models.ForeignKey('property.Property', on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    reserved_by = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    number_guests = models.PositiveIntegerField()
    STATUS_COMPLETED = "completed"
    STATUS_APPROVED = "approved"
    STATUS_CANCELED = "canceled"
    STATUS_PENDING = "pending"
    STATUS_DENIED = "denied"
    STATUS_EXPIRED = "expired"
    STATUS_TERMINATED = "terminated"
    STATUS_PENDING_CANCEL = "pending_cancel"

    STATUS_CHOICES = (
        (STATUS_COMPLETED, "completed"),
        (STATUS_APPROVED, "approved"),
        (STATUS_CANCELED, "canceled"),
        (STATUS_PENDING, "pending"),
        (STATUS_DENIED, "denied"),
        (STATUS_EXPIRED, "expired"),
        (STATUS_TERMINATED , "terminated"),
        (STATUS_PENDING_CANCEL,"pending_cancel")
    )

    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING
    )