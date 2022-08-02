const solc = require('solc');
const fs = require('fs');

const Web3 = require('web3');

const web3 = new Web3('HTTP://127.0.0.1:7545');


let fileContent = fs.readFileSync("demo.sol").toString();
console.log("fileContent: "+fileContent);

// web3.eth.getAccounts().then(console.log);

// create an input structure for my solidity complier
var input = {
    language: "Solidity",
    sources: {
      "demo.sol": {
        content: fileContent,
      },
    },
  
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
};
  
let output = JSON.parse(solc.compile(JSON.stringify(input)));

console.log("output:");
console.log(output);

const ABI = output.contracts["demo.sol"]["demo"].abi;
console.log("ABI:");
console.log(ABI);

const byteCode = output.contracts["demo.sol"]["demo"].evm.bytecode.object;
console.log("byteCode: " + byteCode);

// Deploy smart Contract

let contract = new web3.eth.Contract(ABI); 

let deafultAccount;
web3.eth.getAccounts().then((accounts) => {
    console.log("Account: ", accounts);
    
    deafultAccount = accounts[0];

    contract
        .deploy({
            data: byteCode
        })
        .send({
            from: deafultAccount,
            gas: 500000,
        })
        .on("receipt", (receipt) => {
            console.log("ContractAddress: ", receipt.contractAddress);
        })
        .then((demonContract) => {
            demonContract.methods.x().call((err, data) => {
            console.log("Initial value: ",data);
        })
    })
});