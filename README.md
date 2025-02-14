# SecretInbox

## Overview

SecretInbox is a Solidity smart contract that allows users to send and receive encrypted messages securely on the Ethereum blockchain. The contract leverages Diffie-Hellman key exchange principles to enable end-to-end encryption between users.

## Features

- **Public Key Registration:** Users can register their public keys to receive encrypted messages.
- **Secure Messaging:** Messages are encrypted using AES-GCM before being stored on-chain.
- **Message Storage:** Messages are stored on the blockchain and can be retrieved by the recipient.
- **Event Emission:** Every sent message triggers an event for transparency and off-chain tracking.

## How It Works

1. **Key Exchange:**
   - Each user generates a private key and derives a public key using the contract's generator and prime field.
   - The public key is registered in the contract using `registerRecipientPublicKey()`.
2. **Sending a Message:**
   - The sender encrypts a message using AES-GCM with a derived shared secret.
   - The encrypted message, along with the initialization vector (IV), authentication tag, and sender's public key, is stored on-chain via `sendMessage()`.
3. **Retrieving Messages:**
   - The recipient fetches messages using `getMessages()` and decrypts them off-chain with their private key.

## Smart Contract Methods

### `registerRecipientPublicKey(uint256 _publicKey)`

Registers a user's public key for encrypted message reception.

### `sendMessage(address _recipient, bytes calldata _message, uint256 _messageIV, uint256 _messageAuthTag, uint256 _sendersKey)`

Sends an encrypted message to a recipient.

### `getMessages(address _recipient) external view returns (Message[] memory)`

Retrieves all messages sent to a specific recipient.

## Security Considerations

- **Private Key Safety:** Users must keep their private keys secure, as they are needed for decryption.
- **On-Chain Metadata Exposure:** While message contents are encrypted, metadata (such as sender addresses and timestamps) is visible on-chain.

## License

This project is licensed under the MIT License.
