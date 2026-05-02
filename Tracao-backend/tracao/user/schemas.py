import pydantic
from ninja import ModelSchema,Schema
from user.models import TracaoUser, KYCDocument
from pydantic import Field

class ProducerTransporterRegister(Schema):
    first_name:str
    last_name:str
    email:str
    phone_number:str
    country:str
    city:str
    password:str = Field(min_length=3)

class CooperativeRegister(Schema):
    cooperative_name:str
    email:str
    country:str
    city:str
    password:str = Field(min_length=3)

class ProducerList(ModelSchema):
    class Meta:
        model = TracaoUser
        fields = ['id','first_name','last_name','email','phone_number','country','city']

class TransporterList(ModelSchema):
    class Meta:
        model = TracaoUser
        fields = ['id','first_name','last_name','email','phone_number','country','city']

class CooperativeList(ModelSchema):
    class Meta:
        model = TracaoUser
        fields = ['id','cooperative_name','email','country','city']

class OrganizationRegister(Schema):
    cooperative_name:str # On utilise ce champ pour le nom de l'organisation
    email:str
    country:str
    city:str
    password:str = Field(min_length=3)

class OrganizationList(ModelSchema):
    class Meta:
        model = TracaoUser
        fields = ['id','cooperative_name','email','country','city']

class KYCDocumentSchema(ModelSchema):
    class Meta:
        model = KYCDocument
        fields = ['id', 'status', 'submitted_at', 'reviewed_at', 'rejection_reason']