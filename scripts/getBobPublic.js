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

  const getBobPublic = await secretInboxContract.recipientPublicKeys(
    "0x26baAC08CB753303de111e904e19BaF91e6b5E4d"
  );

  console.log(
    "-------------------- BOB PUBLIC KEY COMPLETED -----------------------"
  );

  console.log(getBobPublic);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
