from django.contrib import admin
from .models import StockProducer, StockOrigin, StockTransporter, Farm, StockDestination

@admin.register(Farm)
class FarmAdmin(admin.ModelAdmin):
    list_display = ('name', 'producer', 'area_hectares', 'is_verified_by_coop', 'created_at')
    search_fields = ('name', 'producer__email')
    list_filter = ('is_verified_by_coop',)


