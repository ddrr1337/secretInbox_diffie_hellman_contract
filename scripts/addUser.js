const { ethers, deployments, network } = require("hardhat");
const { getAccount } = require("../utils/getAccount");
const { getGasPrice } = require("../utils/getGasPrice");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.ALCHEMY_RPC
  );
  const account = getAccount("sec", provider);
  await getGasPrice();

  const secretInboxDeployment = await deployments.get("SecretInbox");
  const secretInboxAddress = secretInboxDeployment.address;
  const secretInboxAbi = secretInboxDeployment.abi;

  const secretInboxContract = new ethers.Contract(
    secretInboxAddress,
    secretInboxAbi,
    account
  );

  const addUser = await secretInboxContract.registerRecipientPublicKey(
    "0x27c49081f97dfacb974f404b7271af8bef7dfe7a0e62bc03ccabf92d3dc90431"
  );

  console.log("Tx:", addUser.hash);

  await addUser.wait();

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
