const crypto = require("crypto");

async function main() {
  // Parámetros del contrato
  const PRIME = BigInt(
    "21888242871839275222246405745257275088548364400416034343698204186575808495617"
  );
  const GENERATOR = BigInt(2); // Base generadora

  // Función eficiente para (base^exp) % mod
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

  // **1. Alice y Bob tienen sus claves**
  const aliceSecret = BigInt(
    "20327789992800515968685381850616334401621686271873813529686836254549785192947"
  );

  // Calcular la clave pública de Alice
  const alicePublicKey = modExp(GENERATOR, aliceSecret, PRIME);

  // Bob's Public Key (lo inventamos aquí para el ejemplo)
  const bobPublicKey = BigInt(
    "5525407190700791873487945301761720323424142263261415277104406390392515361505"
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

  const message =
    "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum";
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
