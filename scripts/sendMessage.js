const { ethers, deployments, network } = require("hardhat");
const { getAccount } = require("../utils/getAccount");
const { getGasPrice } = require("../utils/getGasPrice");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.ALCHEMY_RPC
  );
  const account = getAccount("main", provider);
  await getGasPrice();

  const secretInboxDeployment = await deployments.get("SecretInbox");
  const secretInboxAddress = secretInboxDeployment.address;
  const secretInboxAbi = secretInboxDeployment.abi;

  const secretInboxContract = new ethers.Contract(
    secretInboxAddress,
    secretInboxAbi,
    account
  );

  const sendMessage = await secretInboxContract.sendMessage(
    "0x26baAC08CB753303de111e904e19BaF91e6b5E4d",
    "0x954028a44e5a80fbbe3318f6fd066c6f03c008cc4454e5ef643125344a",
    "0x124f459de3333ae294ac5d2a",
    "0xb2d226319427b997c3f7d739a07921bc",
    "0x2f3c5bf59b3140a492bd73f311dc29fad1fde8b294a40de169d82d47110807bf"
  );

  console.log("Tx:", sendMessage.hash);

  await sendMessage.wait();

  console.log(
    "-------------------- ADD USER AND PUBLIC KEY COMPLETED -----------------------"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
