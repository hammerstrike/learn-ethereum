const express = require('express');
const router = express.Router();
const { ethers } = require("ethers");

const account_0_Address = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
const Greeter = require('../chain/artifacts/contracts/Greeter.sol/Greeter.json');
const greeterContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const eth = () => {
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
  const signer = provider.getSigner('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266');
  const contract = new ethers.Contract(greeterContractAddress, Greeter.abi, provider);
  const signContract = new ethers.Contract(greeterContractAddress, Greeter.abi, signer);

  const signerA = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);

  return {
    provider,
    contract,
    signContract,
    // signer
    signerA
  }
}

/* GET Blocknumber */
router.get('/block-number', async (req, res, next) => {
  const blockNumber = await eth().provider.getBlockNumber();
  const balance = await eth().provider.getBalance(greeterContractAddress);
  res.json({ blockNumber, balance: ethers.utils.formatEther(balance) });
});

/* GET Greet message */
router.get('/greet', async (req, res, next) => {
  const greet = await eth().contract.greet();
  res.json({ greet });
});

/* POST Greet message */
router.post('/greet', async (req, res, next) => {
  const { greet } = req.body || { greet: 'Default message' };
  const transaction = await eth().signContract.setGreeting(greet)
  await transaction.wait();
  res.json({ success: true });
})

/** Sign Transaction */
router.post('/signTransaction', async (req, res) => {

  const transactionCount = await eth().provider.getTransactionCount(account_0_Address);
  console.log('transactionCount', transactionCount);
  // const setGreetingResult = await eth().signContract.setGreeting('test message');
  // console.log('setGreetingResult', setGreetingResult);
  const coerceFunc = (type, value) => {
    console.log('type =>', type);
    console.log('value =>', value);
  }
  const abiCoder = new ethers.utils.AbiCoder(coerceFunc);

  const luckyNumber = Math.floor(Math.random() * 100);
  const encodedMessage = abiCoder.encode(['string'], [`Lucky number: ${luckyNumber}` ]);

  const signedTx = await eth().signerA.signTransaction({
    nonce : 6,
    gasPrice : 0,
    gasLimit: 70000,
    data : encodedMessage
  });

  console.log('signedTx =>', signedTx);

  const sendTransactionResult = await eth().provider.sendTransaction(signedTx);
  const isTxMined = await eth().provider.waitForTransaction(sendTransactionResult.hash );
  const getTransactionReceipt = await eth().provider.getTransactionReceipt( sendTransactionResult.hash );


  res.json({
    success: true,
    transactionCount,
    // setGreetingResult,
    luckyNumber,
    encodedMessage,
    signedTx,
    sendTransactionResult,
    isTxMined,
    getTransactionReceipt
  })
})

module.exports = router;
