import json
import os
import sys
from web3 import Web3
from dotenv import load_dotenv

# Load environment variables from the parent directory
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(backend_dir, '.env')
load_dotenv(dotenv_path=env_path)

# Initialize Web3
RPC_URL = os.getenv("POLYGON_RPC_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")

if not RPC_URL or not PRIVATE_KEY:
    print("❌ ERROR: POLYGON_RPC_URL or PRIVATE_KEY not found in .env file.")
    sys.exit(1)

w3 = Web3(Web3.HTTPProvider(RPC_URL))

if not w3.is_connected():
    print("❌ ERROR: Could not connect to the Polygon network. Check your RPC URL.")
    sys.exit(1)

print(f"✅ Connected to Polygon Network. Chain ID: {w3.eth.chain_id}")

# Set up the account
account = w3.eth.account.from_key(PRIVATE_KEY)
print(f"✅ Loaded Wallet Address: {account.address}")

# Check balance
balance = w3.eth.get_balance(account.address)
balance_eth = w3.from_wei(balance, 'ether')
print(f"💰 Wallet Balance: {balance_eth} POL")

if balance == 0:
    print("❌ ERROR: Wallet balance is 0. You need POL to deploy the contract.")
    sys.exit(1)

# Load ABI and Bytecode
contracts_dir = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(contracts_dir, "abi.json"), "r") as f:
    abi = json.load(f)

with open(os.path.join(contracts_dir, "bytecode.txt"), "r") as f:
    bytecode = f.read().strip()

# Create the contract object
TraceabilityContract = w3.eth.contract(abi=abi, bytecode=bytecode)

# Build the transaction
print("⏳ Building deployment transaction...")
nonce = w3.eth.get_transaction_count(account.address)

# Estimate gas or provide standard gas settings for Polygon Amoy
transaction = TraceabilityContract.constructor().build_transaction({
    "chainId": w3.eth.chain_id,
    "gasPrice": w3.eth.gas_price,
    "from": account.address,
    "nonce": nonce,
})

# Sign the transaction
print("🔐 Signing transaction...")
signed_txn = w3.eth.account.sign_transaction(transaction, private_key=PRIVATE_KEY)

# Send the transaction
print("🚀 Broadcasting transaction to the network...")
try:
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction) # changed from rawTransaction to raw_transaction in newer web3 versions
    print(f"🔗 Transaction hash: {w3.to_hex(tx_hash)}")
    
    # Wait for the transaction receipt
    print("⏳ Waiting for transaction receipt (this may take a few seconds)...")
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    
    contract_address = tx_receipt.contractAddress
    print(f"🎉 SUCCESS! Contract deployed at address: {contract_address}")
    
    print("\n📝 Next Steps:")
    print(f"1. Add CONTRACT_ADDRESS={contract_address} to your .env file.")
    print("2. You can view this contract on the Polygon Explorer using the contract address.")
except Exception as e:
    print(f"❌ ERROR during deployment: {e}")
