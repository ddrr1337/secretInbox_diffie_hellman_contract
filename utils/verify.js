const { run } = require("hardhat");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verify(contractAddress, args, chainId) {
  console.log("Verifying Contract...", contractAddress);

  // Agregar una espera de 10 segundos si el chainId es 11155111
  if (chainId === 11155111) {
    console.log("Chain ID is 11155111 (Sepolia), waiting for 15 seconds...");
    await sleep(15000); // Espera 10 segundos
  }

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Contract already verified.", e);
    } else {
      console.log("Verification failed.", e);
    }
  }
}

module.exports = {
  verify,
};
