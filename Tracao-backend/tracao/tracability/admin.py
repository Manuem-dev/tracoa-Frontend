from django.contrib import admin
from .models import ProductBatch, TransactionEvent, BatchCertification

@admin.register(ProductBatch)
class ProductBatchAdmin(admin.ModelAdmin):
    list_display = ('batch_number', 'initial_stock', 'current_owner', 'is_active', 'created_at')
    search_fields = ('batch_number',)
    list_filter = ('is_active', 'created_at')

@admin.register(TransactionEvent)
class TransactionEventAdmin(admin.ModelAdmin):
    list_display = ('batch', 'event_type', 'sender', 'receiver', 'timestamp')
    search_fields = ('batch__batch_number', 'sender__email', 'receiver__email')
    list_filter = ('event_type', 'timestamp')

@admin.register(BatchCertification)
class BatchCertificationAdmin(admin.ModelAdmin):
    list_display = ('batch', 'certifier', 'certification_name', 'issued_at')
    search_fields = ('batch__batch_number', 'certification_name')
    readonly_fields = ('issued_at',)
