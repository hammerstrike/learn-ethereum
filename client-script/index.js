const { ethers } = require("ethers");
const Greeter = require("./artifacts/contracts/Greeter.sol/Greeter.json");
const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const log = (data) => {
  console.info(JSON.stringify(data, null, 2));
};

const eth = () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://localhost:8545"
  );
  const signer = provider.getSigner();
  const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
  const signContract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
  return {
    provider,
    contract,
    signContract,
  };
};

const getBlockNumber = async () => {
  const blockNumber = await eth().provider.getBlockNumber();
  const balance = await eth().provider.getBalance(greeterAddress);
  log({ blockNumber, balance });
};

const getGreetMessage = async () => {
  const greet = await eth().contract.greet();
  log({ greet });
};

const setGreetMessage = async (message) => {
  const transaction = await eth().signContract.setGreeting(
    message || "Default message"
  );
  await transaction.wait();
  log({ success: true });
};

( async () => {
  const args = process.argv.slice(2);
  switch (args[0]) {
    case "setGreetMessage":
        await setGreetMessage(args[1]);
      break;

    case "getGreetMessage":
        await getGreetMessage();
      break;

    case "getBlockNumber":
    default:
        await getBlockNumber();
      break;
  }
})();
