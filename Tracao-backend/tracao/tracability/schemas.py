from ninja import ModelSchema, Schema
from typing import List, Optional
from tracability.models import ProductBatch, TransactionEvent, BatchCertification

class TransactionEventSchema(ModelSchema):
    class Meta:
        model = TransactionEvent
        fields = ['event_type', 'timestamp', 'location', 'notes']

    sender_email: Optional[str] = None
    receiver_email: Optional[str] = None

    @staticmethod
    def resolve_sender_email(obj):
        return obj.sender.email if obj.sender else None

    @staticmethod
    def resolve_receiver_email(obj):
        return obj.receiver.email if obj.receiver else None

class BatchCertificationSchema(ModelSchema):
    class Meta:
        model = BatchCertification
        fields = ['certification_name', 'issued_at', 'notes']

    certifier_email: Optional[str] = None

    @staticmethod
    def resolve_certifier_email(obj):
        return obj.certifier.email if obj.certifier else None

class ProductBatchSchema(ModelSchema):
    class Meta:
        model = ProductBatch
        fields = ['batch_number', 'is_active', 'created_at']

    product_type: str
    weight: Optional[float]
    origin: str

    @staticmethod
    def resolve_product_type(obj):
        return obj.initial_stock.product_type
    
    @staticmethod
    def resolve_weight(obj):
        return obj.initial_stock.weight

    @staticmethod
    def resolve_origin(obj):
        return obj.initial_stock.origin

class ProductJourneySchema(ProductBatchSchema):
    events: List[TransactionEventSchema]
    certifications: List[BatchCertificationSchema] = []

class CertifyBatchRequest(Schema):
    batch_number: str
    certifier_id: int
    certification_name: str
    notes: Optional[str] = None
