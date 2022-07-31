const { namehash } = require("ethers/lib/utils");
const { ethers } = require("hardhat");
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";
const ZERO_ADDRESS="0x0000000000000000000000000000000000000000";

const sha3 = require('web3-utils').sha3;

module.exports = async ({getNamedAccounts, deployments, network}) => {
    const {deploy} = deployments;
    const {deployer, owner} = await getNamedAccounts();

    const ens = await ethers.getContract('ENSRegistry')
    const resolver = await ethers.getContract('PublicResolver')

    await deploy('ReverseRegistrar', {
        from: deployer, 
        args: [ens.address, resolver.address],
        log: true
    })


    const reverseRegistrar = await ethers.getContract('ReverseRegistrar')
    const transactions = []

    transactions.push(await ens.setSubnodeOwner(ZERO_HASH, sha3('reverse'), owner ));
    transactions.push(await ens.setSubnodeOwner(namehash('reverse'), sha3('addr'), reverseRegistrar.address))
    transactions.push(await ens.setOwner(namehash('reverse'), ZERO_ADDRESS))
    // ESTIMATE GAS -->
    console.log(`Waiting on settings to take place on reverse-registrar ${transactions.length}`)
    await Promise.all(transactions.map((tx) => tx.wait()));



}

module.exports.dependencies = ['registry', 'public-resolver']