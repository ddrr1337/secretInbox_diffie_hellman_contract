const crypto = require("crypto");

async function main() {
  // Función para realizar la exponenciación modular (modExp)
  function modExp(base, exp, mod) {
    let result = BigInt(1);
    base = base % mod;
    while (exp > 0) {
      if (exp % BigInt(2) === BigInt(1)) {
        result = (result * base) % mod;
      }
      exp = exp / BigInt(2);
      base = (base * base) % mod;
    }
    return result;
  }

  // Parámetros del contrato
  const PRIME = BigInt(
    "21888242871839275222246405745257275088548364400416034343698204186575808495617"
  );

  const alicePublicKey = BigInt(
    "0x2f3c5bf59b3140a492bd73f311dc29fad1fde8b294a40de169d82d47110807bf"
  );
  const bobSecret = BigInt(
    "17554452225441193714080563749221478743999703710094566509001290613516874739171"
  );

  //Diffie-Hellman
  const sharedSecret = modExp(alicePublicKey, bobSecret, PRIME);

  function deriveAESKey(sharedSecret) {
    const hash = crypto.createHash("sha256");
    hash.update(sharedSecret.toString());
    return hash.digest().slice(0, 32); // Clave de 256 bits
  }

  const aesKey = deriveAESKey(sharedSecret);

  const encrypted =
    "954028a44e5a80fbbe3318f6fd066c6f03c008cc4454e5ef643125344a";
  const iv = Buffer.from("124f459de3333ae294ac5d2a", "hex");
  const authTag = Buffer.from("b2d226319427b997c3f7d739a07921bc", "hex");

  function decryptMessage(encryptedMessage, key, iv, authTag) {
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag); // Establece el tag de autenticación

    let decrypted = decipher.update(encryptedMessage, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }

  const decryptedMessage = decryptMessage(encrypted, aesKey, iv, authTag);

  console.log("Shared Secret:", sharedSecret.toString());
  console.log("AES Key:", aesKey.toString("hex"));
  console.log("Decrypted Message:", decryptedMessage);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
