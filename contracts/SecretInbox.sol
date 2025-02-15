// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

//dillie-Hellman
contract SecretInbox {
    event MessageSent(
        address indexed sender,
        address indexed recipient,
        bytes messageEncrypted,
        uint256 messageIV,
        uint256 messageAuthTag,
        uint256 sendersKey,
        uint256 timestamp
    );

    uint256 public constant GENERATOR = 2;
    uint256 public constant PRIME =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;

    mapping(address recipientUser => uint256 recipientKey)
        public recipientPublicKeys;

    struct Message {
        address sender;
        bytes messageEncrypted; // Encrypted message as bytes
        uint256 messageIV; // Initialization vector for encryption
        uint256 messageAuthTag; // Authentication tag for encryption
        uint256 sendersKey; // Alice public key
        uint256 timestamp;
    }

    mapping(address => Message[]) public messages;

    function registerRecipientPublicKey(uint256 _publicKey) external {
        require(
            _publicKey > 1 && _publicKey < PRIME,
            "public key out of prime field range"
        );

        recipientPublicKeys[msg.sender] = _publicKey;
    }

    function sendMessage(
        address _recipient,
        bytes calldata _message, // Accept message as bytes
        uint256 _messageIV,
        uint256 _messageAuthTag,
        uint256 _sendersKey
    ) external {
        require(
            _sendersKey > 1 && _sendersKey < PRIME,
            "SENDER KEY out of prime field range"
        );

        uint256 timeNow = block.timestamp;

        messages[_recipient].push(
            Message({
                sender: msg.sender,
                messageEncrypted: _message, // Store as bytes
                messageIV: _messageIV,
                messageAuthTag: _messageAuthTag,
                sendersKey: _sendersKey,
                timestamp: timeNow
            })
        );

        emit MessageSent(
            msg.sender,
            _recipient,
            _message,
            _messageIV,
            _messageAuthTag,
            _sendersKey,
            timeNow
        );
    }

    function getMessages(
        address _recipient
    ) external view returns (Message[] memory) {
        return messages[_recipient];
    }
}
