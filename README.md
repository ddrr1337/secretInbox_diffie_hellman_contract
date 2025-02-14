# SecretInbox Dillie-Hellman

## Overview

SecretInbox is a Solidity smart contract that allows users to send and receive encrypted messages securely on the Ethereum blockchain. The contract leverages Diffie-Hellman key exchange principles to enable end-to-end encryption between users.

## Features

- **Public Key Registration:** Users can register their public keys to receive encrypted messages.
- **Secure Messaging:** Messages are encrypted using AES-GCM before being stored on-chain.
- **Message Storage:** Encrypted messages are stored on the blockchain and can be retrieved by the recipient.
- **Event Emission:** Every sent message triggers an event for transparency and off-chain tracking.

## How It Works

1. **Key Exchange:**
   - Each user generates a private key and derives a public key using the contract's generator and prime field.
   - The public key is registered in the contract using `registerRecipientPublicKey()`.
2. **Sending a Message:**
   - The sender encrypts a message using AES-GCM with a derived shared secret. This shared secret is computed via Diffie-Hellman using the sender’s private key and the recipient’s public key.
   - The encrypted message is stored on-chain along with the Initialization Vector (IV), authentication tag, and the sender's public key.
3. **Retrieving & Decrypting Messages:**
   - The recipient fetches their messages using `getMessages()`.
   - **Decryption Process:**  
     Bob (the recipient) uses his private key and the sender’s public key (included with each message) to compute the shared secret using Diffie-Hellman key exchange. This shared secret is then passed through a key derivation function (e.g., SHA-256) to produce an AES-256 key.
     - Bob then uses this AES key, along with the provided IV and authentication tag, to decrypt the encrypted message via AES-GCM decryption.
     - As a result, Bob recovers the original plaintext message, ensuring that only he can read it.

## Smart Contract Methods

### `registerRecipientPublicKey(uint256 _publicKey)`

Registers a user's public key for receiving encrypted messages.

- **Requirement:** The public key must be within the valid prime field range.

### `sendMessage(address _recipient, bytes calldata _message, uint256 _messageIV, uint256 _messageAuthTag, uint256 _sendersKey)`

Sends an encrypted message to a recipient.

- The function stores the following:
  - The encrypted message (as bytes).
  - The IV used for AES-GCM encryption.
  - The authentication tag ensuring message integrity.
  - The sender's public key for Diffie-Hellman key exchange.

### `getMessages(address _recipient) external view returns (Message[] memory)`

Retrieves all messages sent to a specific recipient.

## Bob's Decryption Process

1. **Shared Secret Computation:**  
   Bob computes the shared secret by using his private key and the sender’s public key (included with each message). This is done via the Diffie-Hellman formula:

```
sharedSecret = (sender's public key)^(Bob's private key) mod PRIME
```

2. **AES Key Derivation:**  
   The shared secret is hashed (using SHA-256, for example) to derive a 256-bit AES key.
3. **Message Decryption:**  
   Using the AES key, along with the provided IV and authentication tag, Bob decrypts the encrypted message with AES-GCM decryption. This recovers the original plaintext message.

## Security Considerations

- **Private Key Safety:** Users must keep their private keys secure, as they are critical for both encryption and decryption.
- **Unique IV Usage:** Each message must have a unique IV to ensure the security properties of AES-GCM.
- **On-Chain Metadata:** While message contents are encrypted, metadata (e.g., sender addresses and timestamps) remain public on the blockchain.

## License

This project is licensed under the MIT License.
