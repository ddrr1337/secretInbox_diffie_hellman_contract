const crypto = require("crypto");
const { modExp, PRIME } = require("../utils/math");

async function main() {
  function generateRandomSecret(prime) {
    return BigInt("0x" + crypto.randomBytes(32).toString("hex")) % prime;
  }

  const GENERATOR = BigInt(2);

  // Generar secreto de Bob
  const bobSecret = generateRandomSecret(PRIME);
  console.log("Secret:", "0x" + bobSecret.toString(16));

  // Calcular la clave pública de Bob
  const bobPublicKey = modExp(GENERATOR, bobSecret, PRIME);
  console.log("Public Key:", "0x" + bobPublicKey.toString(16));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
