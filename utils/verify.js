const { run } = require("hardhat");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verify(contractAddress, args, chainId) {
  console.log("Verifying Contract...", contractAddress);

  if (chainId === 11155111) {
    console.log("Chain ID is 11155111 (Sepolia), waiting for 20 seconds...");
    await sleep(20000);
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
