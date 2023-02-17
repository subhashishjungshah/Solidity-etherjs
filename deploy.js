const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();
async function main() {
  // http://127.0.0.1:7545
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.RPC_PROVIDER
  );
  const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying... Please wait");
  const contract = await contractFactory.deploy();
  //   console.log(contract);
  const transactionReceipt = await contract.deployTransaction.wait(1);
  //   console.log("Here is deployment Receipt:");
  //   console.log(contract.deployTransaction);
  //   console.log(transactionReceipt);

  // This section demonstrate how the function inside the smart contracts can be manipulated
  const transactionResponse = await contract.store("7");
  const transactionreceipt = await transactionResponse.wait(1);
  console.log(transactionreceipt);
  const currentFavNumber = await contract.retrieve();
  console.log(`Current favorite number is: ${currentFavNumber.toString()}`);

  //   console.log("Deploying contracts manually with transaction data");
  //   const nounce = await wallet.getTransactionCount();
  //   const tx = {
  //     nonce: nounce,
  //     gasPrice: 20000000000,
  //     gasLimit: 1000000,
  //     to: null,
  //     value: 0,
  //     data: "",
  //     chainId: 1337,
  //   };
  //   const sentTxnResponse = await wallet.sendTransaction(tx);
  //   await sentTxnResponse;
  //   console.log(sentTxnResponse);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
