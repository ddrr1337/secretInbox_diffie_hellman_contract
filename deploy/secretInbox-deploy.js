require("dotenv").config();
const { networkConfig } = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");
const { getGasPrice } = require("../utils/getGasPrice");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  const gasMultiplier = 1.2;

  await getGasPrice();

  const constructorArgs = [];

  const secretInboxDeploy = await deploy("SecretInbox", {
    from: deployer,
    args: constructorArgs,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
    gasMultiplier: gasMultiplier,
  });

  console.log(
    "----------------------- SECRET INBOX DEPLOYED --------------------------"
  );

  const verifyContract = networkConfig[chainId].verify;

  if (verifyContract) {
    await verify(secretInboxDeploy.address, constructorArgs, chainId);
    console.log(
      "----------------------- VERIFICATION COMPLETED --------------------------"
    );
  }
};

module.exports.tags = ["all", "secret"];
