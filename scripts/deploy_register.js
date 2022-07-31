const hre = require("hardhat");
const namehash = require('eth-ens-namehash');
const tld = "pls";
const ethers = hre.ethers;
const utils = ethers.utils;
const sha3 = require('web3-utils').sha3;
const labelhash = (label) => utils.keccak256(utils.toUtf8Bytes(label))
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";
async function main() {
  const ENSRegistry = await ethers.getContractFactory("ENSRegistry")
  const FIFSRegistrar = await ethers.getContractFactory("FIFSRegistrar")
  const ReverseRegistrar = await ethers.getContractFactory("ReverseRegistrar")
  const PublicResolver = await ethers.getContractFactory("PublicResolver")
  const signers = await ethers.getSigners();
  const accounts = signers.map(s => s.address)

  const ens = await ethers.getContract('ENSRegistry')
  const base = await ethers.getContract('BaseRegistrarImplementation');
  const resolver = await ethers.getContract('PublicResolver')


  const transactions = []
  transactions.push(await base.addController(accounts[0], {from: accounts[0]}))
  transactions.push(await ens.setSubnodeOwner(ZERO_HASH, sha3('pls'), base.address, {from: accounts[0]}))
  transactions.push(await ens.setSubnodeOwner(ZERO_HASH, sha3('pls'), accounts[0], {from: accounts[0]}))
  transactions.push(await ens.setResolver(namehash.hash('pls'), resolver.address, {from: accounts[0]}))
  transactions.push(await resolver['setAddr(bytes32,address)'](namehash.hash('pls'), resolver.address))
  console.log(`Waiting on ${transactions.length} transactions setting base registrar`);
  await Promise.all(transactions.map((tx) => tx.wait()));
};

async function setupResolver(ens, resolver, accounts) {
  const resolverNode = namehash.hash("pls");
  const resolverLabel = labelhash("pls");
  await ens.setSubnodeOwner(ZERO_HASH, resolverLabel, accounts[0]);
  await ens.setResolver(resolverNode, resolver.address);
  await resolver['setAddr(bytes32,address)'](resolverNode, resolver.address);
}

async function setupRegistrar(ens, registrar) {
  await ens.setSubnodeOwner(ZERO_HASH, labelhash(tld), registrar.address);
}

async function setupReverseRegistrar(ens, registrar, reverseRegistrar, accounts) {
  await ens.setSubnodeOwner(ZERO_HASH, labelhash("reverse"), accounts[0]);
  await ens.setSubnodeOwner(namehash.hash("reverse"), labelhash("addr"), reverseRegistrar.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });