const express = require('express');
const router = express.Router();
const { ethers } = require("ethers");

const Greeter = require('../chain/artifacts/contracts/Greeter.sol/Greeter.json');
const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const eth = () => {
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
  const signer = provider.getSigner();
  const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
  const signContract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
  return {
    provider,
    contract,
    signContract
  }
}

/* GET Blocknumber */
router.get('/block-number', async(req, res, next) => {
  const blockNumber = await eth().provider.getBlockNumber();
  const balance = await eth().provider.getBalance(greeterAddress);
  res.json({ blockNumber, balance: ethers.utils.formatEther(balance) });
});

/* GET Greet message */
router.get('/greet', async(req, res, next) => {
  const greet = await eth().contract.greet();
  res.json({ greet });
});

/* POST Greet message */
router.post('/greet', async(req, res, next) => {
  const { greet } = req.body || { greet : 'Default message'};
  const transaction = await eth().signContract.setGreeting(greet)
  await transaction.wait();
  res.json({ success : true });
})

module.exports = router;
