from django.db import models
from multiselectfield import MultiSelectField
from django_countries.fields import CountryField

# Create your models here.
class Property(models.Model):
    title = models.CharField(max_length=50)
    host = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=7, decimal_places=2, help_text="CAD per night")
    street = models.CharField(max_length=100)
    city = models.CharField(max_length=30)
    province = models.CharField(max_length=30)
    country = CountryField()
    postal_code = models.CharField(max_length=20)
    max_guests = models.PositiveIntegerField()
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.0)
    content = models.TextField(blank=True)
    beds = models.PositiveIntegerField(default=1)
    baths = models.PositiveIntegerField(default=1)
    
    
    AMENITIES_CHOICES = (
        ('wifi', 'Wifi'),
        ('tv', 'TV'),
        ('kitchen', 'Kitchen'),
        ('workspace', 'Workspace'),
        ('air_conditioning', 'Air Conditioning'),
        ('heating', 'Heating'),
        ('washer', 'Washer'),
        ('dryer', 'Dryer'),
    )
    # AMENITIES_CHOICES = (
    #     ('Wifi', 'Wifi'),
    #     ('TV', 'TV'),
    #     ('Kitchen', 'Kitchen'),
    #     ('Workspace', 'Workspace'),
    #     ('Air_Conditioning', 'Air Conditioning'),
    #     ('Heating', 'Heating'),
    #     ('Washer', 'Washer'),
    #     ('Dryer', 'Dryer'),
    # )
    
    amenities = MultiSelectField(choices=AMENITIES_CHOICES, max_length=100, blank=True)
    # amenities = models.MultipleChoiceField(choices=AMENITIES_CHOICES, max_length=100, blank=True)
    start_available_date = models.DateField()
    end_available_date = models.DateField(null=True, blank=True)   
    
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    
    def get_rating(self):
        reviews = self.reviews.all().filter(to_guest=False)
        if len(reviews) == 0:
            return 5
        all_ratings = 0.
        for review in reviews:
            all_ratings += review.rating_average()
            
        return round(all_ratings / len(reviews), 2)
    
    def __str__(self):
        return "id: " + str(self.id) + ': ' + self.title
    
class Photo(models.Model):
    file = models.ImageField(upload_to="property_photos", default="", blank=True, null=True)
    property = models.ForeignKey(
        "property.Property", related_name="photos", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.property.title + " " + self.file.name
    