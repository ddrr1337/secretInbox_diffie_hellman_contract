const crypto = require("crypto");
const { modExp, PRIME } = require("../utils/math");

async function main() {
  const GENERATOR = BigInt(2); // Base generadora

  // **1. Alice y Bob tienen sus claves**
  const aliceSecret = BigInt(
    "0x6e457c0fe37ec39dec99534e2941e0f2770dc2620d1ed686a43b572df651087"
  );

  // Calcular la clave pública de Alice
  const alicePublicKey = modExp(GENERATOR, aliceSecret, PRIME);

  // Bob's Public Key (lo inventamos aquí para el ejemplo)
  const bobPublicKey = BigInt(
    "0x27c49081f97dfacb974f404b7271af8bef7dfe7a0e62bc03ccabf92d3dc90431"
  );

  // **2. Alice calcula la clave compartida usando Bob's Public Key**
  const sharedSecret = modExp(bobPublicKey, aliceSecret, PRIME);

  // **3. Derivar clave AES de 256 bits**
  function deriveAESKey(sharedSecret) {
    const hash = crypto.createHash("sha256");
    hash.update(sharedSecret.toString());
    return hash.digest().slice(0, 32); // Clave de 256 bits
  }

  const aesKey = deriveAESKey(sharedSecret);

  // **4. Cifrado AES-GCM**
  function encryptMessage(message, key) {
    const iv = crypto.randomBytes(12); // AES-GCM necesita IV único
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    let encrypted = cipher.update(message, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");

    return { encrypted, iv: iv.toString("hex"), authTag };
  }

  const message = "This is a top secret message!";
  const encryptedMessage = encryptMessage(message, aesKey);

  console.log("Alice's Secret:", aliceSecret.toString());

  console.log("Bob's Public Key:", bobPublicKey.toString());
  console.log("Shared Secret:", sharedSecret.toString());
  console.log("AES Key:", aesKey.toString("hex"));
  console.log("Encrypted Message:", "0x" + encryptedMessage.encrypted);
  console.log("IV:", "0x" + encryptedMessage.iv);
  console.log("Auth Tag:", "0x" + encryptedMessage.authTag);
  console.log("Alice's Public Key:", "0x" + alicePublicKey.toString(16));
  console.log("Message:", encryptedMessage);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
