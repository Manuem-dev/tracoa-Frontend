from ninja_extra import api_controller, route
from tracability.models import ProductBatch, BatchCertification
from user.models import TracaoUser
from tracability.schemas import ProductBatchSchema, ProductJourneySchema, CertifyBatchRequest, BatchCertificationSchema
from django.shortcuts import get_object_or_404
from .blockchain import blockchain

@api_controller('/tracability', auth=None)
class TracabilityController:
    
    @route.get('/batches', response=list[ProductBatchSchema])
    def get_all_batches(self):
        """Retourne la liste de tous les lots (batches) enregistrés."""
        return ProductBatch.objects.all().select_related('initial_stock')

    @route.get('/journey/{batch_number}', response=ProductJourneySchema)
    def get_product_journey(self, batch_number: str):
        """Retourne l'historique complet (la timeline) d'un lot spécifique en utilisant son UUID."""
        batch = get_object_or_404(
            ProductBatch.objects.prefetch_related('events', 'events__sender', 'events__receiver', 'certifications', 'certifications__certifier'),
            batch_number=batch_number
        )
        return batch

    @route.post('/certify', response=BatchCertificationSchema)
    def certify_batch(self, request: CertifyBatchRequest):
        """Permet à un organisme de certification d'ajouter un label à un lot."""
        batch = get_object_or_404(ProductBatch, batch_number=request.batch_number)
        certifier = get_object_or_404(TracaoUser, id=request.certifier_id, is_certifier=True)
        
        cert = BatchCertification.objects.create(
            batch=batch,
            certifier=certifier,
            certification_name=request.certification_name,
            notes=request.notes
        )
        return cert

    @route.get('/verify/{batch_number}')
    def verify_batch_on_blockchain(self, batch_number: str):
        """Vérifie l'authenticité d'un lot directement sur la blockchain (Idéal pour QR Code)."""
        chain_data = blockchain.get_batch(batch_number)
        
        if not chain_data or chain_data[0] == "": # Si batch_number est vide dans la struct
            return {"is_authentic": False, "message": "Lot introuvable sur la blockchain"}
            
        # Récupérer les certifications depuis la DB (la Blockchain vérifie l'existence et l'origine du lot)
        certifications = list(BatchCertification.objects.filter(batch__batch_number=batch_number).values_list('certification_name', flat=True))
        
        return {
            "is_authentic": True,
            "message": "Ce lot est certifié par la blockchain ChainCacao.",
            "certifications_obtenues": certifications,
            "blockchain_data": {
                "batch_number": chain_data[0],
                "producer_email": chain_data[1],
                "weight": chain_data[2],
                "origin": chain_data[3],
                "timestamp": chain_data[4]
            }
        }
