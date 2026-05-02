#  Tracao - Backend (ChainCacao)

Bienvenue sur le dépôt du Backend de **Tracao (ChainCacao)**, une plateforme innovante et ultra-sécurisée dédiée à la traçabilité des produits agricoles (notamment le cacao et le café) au Togo. 

Cette API permet de suivre le trajet complet d'un produit, **du producteur jusqu'à l'importateur européen**, en garantissant l'intégrité des données grâce à la technologie **Blockchain** et en répondant aux exigences strictes de la réglementation **EUDR**.

Ce backend est propulsé par **Django** et **Django Ninja Extra** pour offrir des API RESTful rapides, sécurisées et facilement documentées.

---

##  Fonctionnalités Clés (Spécial Hackathon)

1. **Ancrage Blockchain (Vyper / Web3)** : Chaque étape logistique (Récolte, Stockage Coopérative, Transport, Export) est "gravée" sur un Smart Contract inaltérable. La fraude sur le poids ou l'origine devient impossible.
2. **Conformité EUDR (Polygones GPS)** : L'API permet d'enregistrer et de faire valider par une coopérative le tracé GPS exact du champ de l'agriculteur. Cette origine géographique précise suit le sac de cacao jusqu'en Europe.
3. **Système de Certification Premium** : Les organismes certificateurs (Bio, Fairtrade) peuvent apposer leurs labels officiels directement sur les lots enregistrés.
4. **Système KYC (Know Your Customer)** : Un module de vérification d'identité strict (Pièce d'identité Recto/Verso + Selfie) avec un workflow d'approbation administrateur pour s'assurer que chaque acteur est légitime.
5. **Scanner QR Code API** : Un endpoint de vérification (`/api/tracability/verify/`) lit directement les preuves sur la blockchain et affiche les labels pour l'acheteur final européen.

---

##  Prérequis

Avant de commencer, assurez-vous d'avoir installé sur votre machine :
- **Python** (version 3.10 ou supérieure)
- **Git**

---

##  Installation et Démarrage Rapide

Suivez ces étapes pour configurer et lancer le projet localement.

### 1. Cloner le projet

Ouvrez votre terminal, placez-vous dans le dossier de votre choix et exécutez :

```bash
git clone https://github.com/MIABE-HACKATON-2026/Tracao-backend.git
cd Tracao-backend
```

### 2. Créer un environnement virtuel

Il est fortement recommandé d'utiliser un environnement virtuel pour isoler les dépendances du projet.

**Sur Windows :**
```bash
python -m venv venv
```

**Sur Linux / macOS :**
```bash
python3 -m venv venv
```

### 3. Activer l'environnement virtuel

**Sur Windows :**
```bash
venv\Scripts\activate
```

**Sur Linux / macOS :**
```bash
source venv/bin/activate
```

*(Votre terminal devrait maintenant afficher `(venv)` au début de la ligne de commande).*

### 4. Installer les dépendances

Assurez-vous d'être dans le dossier contenant le fichier `requirements.txt` (à la racine), puis exécutez :

```bash
pip install -r requirements.txt
```

### 5. Appliquer les migrations de base de données

Le projet utilise une base de données locale pour le développement. Naviguez dans le sous-dossier `tracao` (où se trouve `manage.py`) et initialisez la base de données :

```bash
cd tracao
python manage.py makemigrations
python manage.py migrate
```

### 6. Créer un compte Administrateur (Superuser)

Pour accéder au panel d'administration central et gérer les utilisateurs (approuver les KYC, voir les fermes GPS, etc.), créez un compte admin :

```bash
python manage.py createsuperuser
```
Laissez-vous guider par les instructions à l'écran :
- **Email** : (ex: admin@tracao.com)
- **Password** : (Tapez votre mot de passe. *Note : Rien ne s'affiche lors de la frappe pour des raisons de sécurité*)
- **Password (again)** : (Confirmez le mot de passe)

### 7. Lancer le serveur de développement

Vous êtes maintenant prêt à démarrer l'application ! Toujours dans le dossier `tracao`, exécutez :

```bash
python manage.py runserver
```

*(Note : Au démarrage, le serveur va automatiquement compiler et déployer le Smart Contract Traceability.vy sur une blockchain locale virtuelle !)*

Si tout s'est bien passé, le serveur est en ligne sans erreur. Vous pouvez y accéder via :
 **http://127.0.0.1:8000/**

---

##  Découverte des Interfaces

Une fois le serveur lancé, voici les points d'entrée principaux pour exploiter le projet :

-  **Panel d'Administration Django :** [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)
  *Connectez-vous avec le compte Superuser. Vous pourrez y valider les statuts KYC, visualiser les fermes GPS (Polygones), et gérer toutes les étapes de logistique manuellement.*

- **Documentation Interactive de l'API (Swagger) :** [http://127.0.0.1:8000/api/docs](http://127.0.0.1:8000/api/docs)
  *C'est le point d'entrée pour les développeurs Frontend/Mobile. Toutes les routes d'inscription (`exporter_signup`, `certifier_signup`), d'upload de fichiers KYC, et de tracking y sont répertoriées de manière visuelle et testable en temps réel.*

---

##  Contact & Support

Pour toute soumission d'inquiétude ou retour, n'hésitez pas à nous joindre à l'adresse suivante : 
 **bchain2026@gmail.com**

**Équipe B-chain MBH 2026. En route vers la traçabilité absolue !**
