const crypto = require("crypto");
const { modExp, PRIME } = require("../utils/math");

async function main() {
  const alicePublicKey = BigInt(
    "0x0a093e0affe9d19a004aeb130b576693bc89c7fdc1a84645262e1e43e25a1d8e"
  );
  const bobSecret = BigInt(
    "0x29ade3d1c7564839432545cbb19e56494cdb91aa2e54b3776b2041c9550ca901"
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
    "85b5a62dd8f16482da7335e4e06bafedb77993e066859b6cd54f25b9ee";
  const iv = Buffer.from("700904f811463bbee8806218", "hex");
  const authTag = Buffer.from("a9c04c98f913b029eeec056713124da8", "hex");

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
