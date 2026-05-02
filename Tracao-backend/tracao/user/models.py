from django.db import models
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin
from phonenumber_field.modelfields import PhoneNumberField
from django_countries.fields import CountryField
from django.contrib.auth.models import BaseUserManager



# Create User Model and manager for more customization and control over user authentication

class CustomUserManager(BaseUserManager):
    def create_user(self,email,password=None,**extra_fields):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)

        extra_fields.setdefault('is_transporter', False)
        extra_fields.setdefault('is_producer', False)
        extra_fields.setdefault('is_cooperative_source', False)
        extra_fields.setdefault('is_cooperative_destination', False)
        extra_fields.setdefault('is_exporter', False)
        extra_fields.setdefault('is_certifier', False)
        extra_fields.setdefault('is_eu_importer', False)
        extra_fields.setdefault('is_government', False)
        extra_fields.setdefault('country', 'Togo')
        extra_fields.setdefault('city', 'Lome')

        user = self.model(
            email=email,
           **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)
        return user



    def create_superuser(self,email,password=None,**extra_fields):

        email=self.normalize_email(email)
        
        
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True) 

        extra_fields.setdefault('is_transporter', True)
        extra_fields.setdefault('is_producer', True)
        extra_fields.setdefault('is_cooperative_source', True)
        extra_fields.setdefault('is_cooperative_destination', True)
        extra_fields.setdefault('is_exporter', True)
        extra_fields.setdefault('is_certifier', True)
        extra_fields.setdefault('is_eu_importer', True)
        extra_fields.setdefault('is_government', True)

        return self.create_user(email, password, **extra_fields)


# The Custom User Model

class TracaoUser(AbstractBaseUser,PermissionsMixin):
    email = models.EmailField(unique=True)
    cooperative_name = models.CharField(max_length=200,blank=True,null=True)
    first_name = models.CharField(max_length=200,blank=True,null=True)
    last_name = models.CharField(max_length=200,blank=True,null=True)
    phone_number = PhoneNumberField(blank=True,null=True)
    country = CountryField(blank_label='(Sélectionnez un pays)',default="Togo",blank=True,null=True)
    city = models.CharField(max_length=100,default="Lome",blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



    is_transporter = models.BooleanField(default=False)
    is_producer = models.BooleanField(default=False)
    is_cooperative_source = models.BooleanField(default=False)
    is_cooperative_destination = models.BooleanField(default=False)
    is_exporter = models.BooleanField(default=False)
    is_certifier = models.BooleanField(default=False)
    is_eu_importer = models.BooleanField(default=False)
    is_government = models.BooleanField(default=False)
    

    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = CustomUserManager()
    
    
    USERNAME_FIELD = 'email'
    #REQUIRED_FIELDS = ['first_name','last_name','phone_number','country','city']
    
    
    def __str__(self):
        return self.email

    




# User profil picture




class ProfilePic(models.Model):
    user = models.OneToOneField(TracaoUser, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='profile_pictures', blank=True, null=True)
    
    def __str__(self):
        return self.user.email

class KYCDocument(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'En attente'),
        ('APPROVED', 'Approuvé'),
        ('REJECTED', 'Rejeté'),
    ]
    user = models.OneToOneField(TracaoUser, on_delete=models.CASCADE, related_name='kyc_document')
    id_card_front = models.ImageField(upload_to='kyc_documents/front/', blank=True, null=True, verbose_name="Carte d'identité (Recto)")
    id_card_back = models.ImageField(upload_to='kyc_documents/back/', blank=True, null=True, verbose_name="Carte d'identité (Verso)")
    selfie_photo = models.ImageField(upload_to='kyc_documents/selfie/', blank=True, null=True, verbose_name="Selfie avec la carte")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING', verbose_name="Statut KYC")
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True, null=True, verbose_name="Motif de rejet")
    
    def __str__(self):
        return f"KYC pour {self.user.email} - {self.get_status_display()}"


