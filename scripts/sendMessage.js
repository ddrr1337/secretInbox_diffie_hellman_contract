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
    "0xc481b2ce4f6e220000aa8a2e7334d3964d417848dc89b0f6bcaa08f27686967e5abdb375817320cbbfe4a93a82e57399c5b098c9433f8d3034b55212b2b299bd75ce79ee1fa14230f2faa4b91bdc476cdab4b391a0d68c5c1b4b33bd105461a5b47c20cb5fe328fc68b5abeb4ac5026f70eaed299b4e5da152a5f765dc65515088f2cc90de78efd217305cba433768b9029166ec015518217d23ad2dcb477fb61fc98b6012eeeebce7d8722e8241aef1a132255de8171fb3561dd6a849feffce793f151a90b9fc3ffd6dc178756e3356985ecf9210ac8555aa4186a03b1e1e49118f2c6bec45b7eed04438642ecc6754fcb52eb8761f01ef235aaa3161303de3b559d5a2a5f73f33e2154da158b5e3635f8b806be05b3bae5e3dbfd7b0ae6c3c1be6ceba2f88e215f1d8c82c0c2587d38dd8139d4e04bb196c8f394c91253dcf7e70ff5ce88a2c8de8aa3108dde4255c33c2531e46fd8a096d014ca8c60e0c294b5df55155274b7df0f5ef331edfb8418bf511675fd5106a138de0e908c8e6617de8f10e2d08d1faad0ef8e23770ecb9b93585fd3a31e0feb831b2916c6b20bc35d6dccf19fec57cfbd7bd6063451b49946f06fc00bfa99f8a8dadcb941ad3eca256c83c97911bf3581d68383acbc3338a195b1506018a9e0a401af5155c46029afcf99bd785a7ce91306ea60f3c0afdf35b41e07854f82d12cd5c36d36889ab75bd155c7082a43f030b5933514a0ae673ab5c78a4c5190835ab2b30fa82fc47e44379eab058ce2148eb55a2ffcc2d9da641cd8f3a94a3e07b7bcc72bd6d44e7a6583e69efc27170292b98a4fb5898334fb6ee951e58af7b3717a00ace4c124763878f1b2976b787e36c404b7f8abc497987adb505e1f642b4e3d9ae676368e7d710298c5ca2e3f8d0be745ac52491f7fd61c381115de73a6e17dc49c7911e5b4efe6b73d7624e10aa4a7e8a160142d125bcba0b50e61b96e86f3ca61e18a962eea607afb1b57d3f753da047022c5f71e0cfe65e3a31b07bf797aea8b7672405aa19c9c389fd82b889281ed2e11d788257b3ad0962093bf3a35cefa85ecf2d1c93342dd39c0017bbefd1a765a3d3b9ae56286682524e95f74da55ef8978f6a75054e59c5a8765ebdb6c188a474274c508e54903b6b6d381b0b01250afbd1234f972ce295803c308e1450e07a1b470efb",
    "0x16d93a205bcbe0919f543012",
    "0x3b5e803a10412f63f0e9bfeb0fee2334",
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
