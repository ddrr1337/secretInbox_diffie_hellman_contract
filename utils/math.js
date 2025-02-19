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

module.exports = { modExp, PRIME };
