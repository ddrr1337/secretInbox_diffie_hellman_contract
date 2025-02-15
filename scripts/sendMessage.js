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
    "0xF0cfffB35BfADc51AaDdfBbe20fc7a4CBfB2feA8",
    "0x85b5a62dd8f16482da7335e4e06bafedb77993e066859b6cd54f25b9ee",
    "0x700904f811463bbee8806218",
    "0xa9c04c98f913b029eeec056713124da8",
    "0xa093e0affe9d19a004aeb130b576693bc89c7fdc1a84645262e1e43e25a1d8e"
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
