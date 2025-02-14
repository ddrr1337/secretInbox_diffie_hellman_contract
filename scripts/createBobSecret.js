const crypto = require("crypto");

async function main() {
  function generateRandomSecret(prime) {
    return BigInt("0x" + crypto.randomBytes(32).toString("hex")) % prime;
  }

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

  const PRIME = BigInt(
    "21888242871839275222246405745257275088548364400416034343698204186575808495617"
  );

  const GENERATOR = BigInt(2);

  // Generar secreto de Bob
  const bobSecret = generateRandomSecret(PRIME);
  console.log("Bob's Secret:", bobSecret.toString());

  // Calcular la clave pública de Bob
  const bobPublicKey = modExp(GENERATOR, bobSecret, PRIME);
  console.log("Bob's Public Key:", bobPublicKey.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
