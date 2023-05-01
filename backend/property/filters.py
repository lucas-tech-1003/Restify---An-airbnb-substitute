import django_filters.rest_framework as filters
from .models import Property


class PropertyFilter(filters.FilterSet):
    price = filters.RangeFilter(field_name='price')
    max_guests = filters.RangeFilter(field_name='max_guests')
    AMENITIES_CHOICES = (
        ('wifi', 'wifi'),
        ('tv', 'tv'),
        ('kitchen', 'kitchen'),
        ('workspace', 'workspace'),
        ('air_conditioning', 'air_conditioning'),
        ('heating', 'heating'),
        ('washer', 'washer'),
        ('dryer', 'dryer'),
    )
    amenities = filters.MultipleChoiceFilter(field_name='amenities', lookup_expr='contains', choices=Property.AMENITIES_CHOICES, conjoined=True)
    available_date = filters.DateFromToRangeFilter(field_name='start_available_date')
    city = filters.AllValuesMultipleFilter(field_name='city')
    country = filters.AllValuesMultipleFilter(field_name='country')
    province = filters.AllValuesMultipleFilter(field_name='province')
    class Meta:
        model = Property
        fields = [
            'city', 
            'province',
            'country', 
            'max_guests', 
            'price', 
            'available_date',
            'amenities'
        ]