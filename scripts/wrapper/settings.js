const hre = require("hardhat");
const namehash = require('eth-ens-namehash');
const tld = "pls";
const ethers = hre.ethers;
const utils = ethers.utils;
const labelhash = (label) => utils.keccak256(utils.toUtf8Bytes(label))
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";

const sha3 = require('web3-utils').sha3;

async function main(){
    const signers = await ethers.getSigners();
    const accounts = signers.map(s => s.address)
await setupResolver(accounts)
           
}

async function setupResolver(accounts){
    const ens = await ethers.getContract('ENSRegistry');
    await ens.setSubnodeOwner(ZERO_HASH, sha3('pls'), accounts[0]);
}


main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })

