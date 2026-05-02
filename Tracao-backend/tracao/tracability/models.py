from django.db import models
from user.models import TracaoUser
from stock.models import StockProducer
import uuid

class ProductBatch(models.Model):
    batch_number = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    initial_stock = models.OneToOneField(StockProducer, on_delete=models.CASCADE, related_name='batch')
    current_owner = models.ForeignKey(TracaoUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='owned_batches')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Lot {self.batch_number} - {self.initial_stock.product_type}"

class TransactionEvent(models.Model):
    EVENT_TYPES = [
        ('CREATED', 'Créé par le producteur'),
        ('RECEIVED_SOURCE', 'Reçu par la coopérative source'),
        ('IN_TRANSIT', 'En transit (Transporteur)'),
        ('RECEIVED_DESTINATION', 'Reçu par la coopérative de destination'),
        ('SOLD', 'Vendu à l\'acheteur'),
    ]
    batch = models.ForeignKey(ProductBatch, on_delete=models.CASCADE, related_name='events')
    sender = models.ForeignKey(TracaoUser, related_name='sent_transactions', on_delete=models.SET_NULL, null=True, blank=True)
    receiver = models.ForeignKey(TracaoUser, related_name='received_transactions', on_delete=models.SET_NULL, null=True, blank=True)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    
    timestamp = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.event_type} - Lot {self.batch.batch_number}"

class BatchCertification(models.Model):
    batch = models.ForeignKey(ProductBatch, on_delete=models.CASCADE, related_name='certifications')
    certifier = models.ForeignKey(TracaoUser, on_delete=models.CASCADE, related_name='issued_certifications')
    certification_name = models.CharField(max_length=100) # ex: 'Fairtrade', 'Bio EU', 'Rainforest Alliance'
    issued_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.certification_name} pour {self.batch.batch_number}"
