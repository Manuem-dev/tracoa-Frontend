import os
from web3 import Web3
from web3.providers.eth_tester import EthereumTesterProvider
from web3.providers.eth_tester import EthereumTesterProvider
from django.conf import settings

# Constante du contrat Vyper
CONTRACT_PATH = os.path.join(settings.BASE_DIR.parent, 'contracts', 'Traceability.vy')

class BlockchainService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(BlockchainService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance
        
    def _initialize(self):
        # Initialisation Web3 avec un Testnet local (en mémoire)
        self.w3 = Web3(EthereumTesterProvider())
        # Le premier compte généré par eth-tester sera l'admin du contrat
        self.w3.eth.default_account = self.w3.eth.accounts[0]
        
        import json
        
        # Chemins vers les fichiers compilés
        ABI_PATH = os.path.join(settings.BASE_DIR.parent, 'contracts', 'abi.json')
        BYTECODE_PATH = os.path.join(settings.BASE_DIR.parent, 'contracts', 'bytecode.txt')
        
        # Chargement de l'ABI et du Bytecode
        with open(ABI_PATH, 'r') as f:
            self.abi = json.load(f)
            
        with open(BYTECODE_PATH, 'r') as f:
            self.bytecode = f.read().strip()
        
        # Déploiement
        TraceabilityContract = self.w3.eth.contract(abi=self.abi, bytecode=self.bytecode)
        tx_hash = TraceabilityContract.constructor().transact()
        tx_receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        self.contract_address = tx_receipt.contractAddress
        self.contract = self.w3.eth.contract(
            address=self.contract_address,
            abi=self.abi
        )
        print(f"✅ Blockchain: Contrat Traceability déployé à l'adresse {self.contract_address}")

    def create_batch(self, batch_number: str, producer_email: str, weight: str, origin: str):
        try:
            tx_hash = self.contract.functions.create_batch(
                str(batch_number), 
                str(producer_email), 
                str(weight), 
                str(origin)
            ).transact()
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            return receipt.transactionHash.hex()
        except Exception as e:
            print(f"Erreur Blockchain (create_batch): {e}")
            return None

    def log_transaction(self, batch_number: str, sender_email: str, receiver_email: str, event_type: str):
        try:
            tx_hash = self.contract.functions.log_transaction(
                str(batch_number),
                str(sender_email),
                str(receiver_email),
                str(event_type)
            ).transact()
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            return receipt.transactionHash.hex()
        except Exception as e:
            print(f"Erreur Blockchain (log_transaction): {e}")
            return None

    def get_batch(self, batch_number: str):
        try:
            return self.contract.functions.batches(str(batch_number)).call()
        except:
            return None

# Instance globale
blockchain = BlockchainService()
