# pragma version ^0.4.0

event BatchCreated:
    batch_number: String[100]
    producer: String[100]
    timestamp: uint256

event BatchTransferred:
    batch_number: String[100]
    sender: String[100]
    receiver: String[100]
    event_type: String[50]
    timestamp: uint256

struct Batch:
    batch_number: String[100]
    producer_email: String[100]
    weight: String[50]
    origin: String[100]
    timestamp: uint256

batches: public(HashMap[String[100], Batch])
batch_exists: public(HashMap[String[100], bool])

@external
def create_batch(_batch_number: String[100], _producer: String[100], _weight: String[50], _origin: String[100]):
    assert not self.batch_exists[_batch_number], "Batch already exists"
    
    self.batches[_batch_number] = Batch(
        batch_number=_batch_number,
        producer_email=_producer,
        weight=_weight,
        origin=_origin,
        timestamp=block.timestamp
    )
    self.batch_exists[_batch_number] = True
    
    log BatchCreated(batch_number=_batch_number, producer=_producer, timestamp=block.timestamp)

@external
def log_transaction(_batch_number: String[100], _sender: String[100], _receiver: String[100], _event_type: String[50]):
    assert self.batch_exists[_batch_number], "Batch does not exist"
    
    log BatchTransferred(batch_number=_batch_number, sender=_sender, receiver=_receiver, event_type=_event_type, timestamp=block.timestamp)
