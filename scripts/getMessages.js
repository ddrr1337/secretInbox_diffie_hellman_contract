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

  const messages = await secretInboxContract.getMessages(
    "0x26baAC08CB753303de111e904e19BaF91e6b5E4d"
  );
  console.log("--------------------  MESSAGES  -----------------------");
  console.log();
  messages.map((item, index) => {
    console.log(
      `--------------------  MESSAGE ${index} -----------------------`
    );
    console.log("Sender:", item.sender);
    console.log("Encrypted Message:", item.messageEncrypted);
    console.log("Message IV:", item.messageIV._hex);
    console.log("Message Auth Tag:", item.messageAuthTag._hex);
    console.log("Senders Public key:", item.sendersKey._hex);
    console.log("------------------------------------------------------");
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
