from ninja_extra import api_controller,route
from ninja_extra.permissions import IsAuthenticated,AllowAny,IsAdminUser
from ninja import File
from ninja.files import UploadedFile
from user.schemas import ProducerTransporterRegister,CooperativeRegister,ProducerList,TransporterList,CooperativeList,OrganizationRegister,OrganizationList, KYCDocumentSchema
from user.models import TracaoUser, KYCDocument
from django.shortcuts import get_object_or_404


User = TracaoUser

@api_controller('/users',auth=None)
class UserController:
    @route.post("/producer_signup",response = ProducerList)
    def register_producer(self,user:ProducerTransporterRegister):
        user_data = user.model_dump()
        email = user_data.get('email')
        user_model, created = User.objects.get_or_create(email=email, defaults={**user_data, 'is_producer': True})
        if not created:
            # Update fields if necessary, or just return existing
            pass
        return user_model
        
    @route.post("/transporter_signup",response = TransporterList)
    def register_transporter(self,user:ProducerTransporterRegister):
        user_data = user.model_dump()
        email = user_data.get('email')
        user_model, created = User.objects.get_or_create(email=email, defaults={**user_data, 'is_transporter': True})
        return user_model

    @route.post("/cooperative_signup",response = CooperativeList)
    def register_cooperative(self,user:CooperativeRegister):
        user_data = user.model_dump()
        email = user_data.get('email')
        user_model, created = User.objects.get_or_create(email=email, defaults={**user_data, 'is_cooperative_source': True})
        return user_model

    @route.get("/all_producers",response = list[ProducerList])
    def get_all_producers(self):
        return User.objects.filter(is_producer=True)

    @route.get("/all_transporters",response = list[TransporterList])
    def get_all_transporters(self):
        return User.objects.filter(is_transporter=True)

    @route.get("/all_cooperatives",response = list[CooperativeList])
    def get_all_cooperatives(self):
        return User.objects.filter(is_cooperative_source=True)

    @route.post("/exporter_signup",response = OrganizationList)
    def register_exporter(self,user:OrganizationRegister):
        user_data = user.model_dump()
        user_data['is_exporter'] = True
        user_model = User.objects.create(**user_data)
        return user_model

    @route.post("/certifier_signup",response = OrganizationList)
    def register_certifier(self,user:OrganizationRegister):
        user_data = user.model_dump()
        user_data['is_certifier'] = True
        user_model = User.objects.create(**user_data)
        return user_model

    @route.post("/importer_signup",response = OrganizationList)
    def register_importer(self,user:OrganizationRegister):
        user_data = user.model_dump()
        user_data['is_eu_importer'] = True
        user_model = User.objects.create(**user_data)
        return user_model

    @route.post("/government_signup",response = OrganizationList)
    def register_government(self,user:OrganizationRegister):
        user_data = user.model_dump()
        user_data['is_government'] = True
        user_model = User.objects.create(**user_data)
        return user_model

    @route.post("/kyc/upload", response=KYCDocumentSchema)
    def upload_kyc_documents(
        self,
        user_id: int,
        id_card_front: UploadedFile = File(...),
        id_card_back: UploadedFile = File(...),
        selfie_photo: UploadedFile = File(...)
    ):
        """Permet à un utilisateur de soumettre ses documents KYC pour vérification."""
        user = get_object_or_404(TracaoUser, id=user_id)
        
        # Supprime l'ancien KYC s'il existait
        if hasattr(user, 'kyc_document'):
            user.kyc_document.delete()
            
        kyc = KYCDocument.objects.create(
            user=user,
            id_card_front=id_card_front,
            id_card_back=id_card_back,
            selfie_photo=selfie_photo,
            status='PENDING'
        )
        return kyc

    @route.get("/kyc/status/{user_id}", response=KYCDocumentSchema)
    def get_kyc_status(self, user_id: int):
        """Récupère le statut actuel du KYC de l'utilisateur."""
        user = get_object_or_404(TracaoUser, id=user_id)
        kyc = get_object_or_404(KYCDocument, user=user)
        return kyc