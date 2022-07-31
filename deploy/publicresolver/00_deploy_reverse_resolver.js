const { ethers } = require("hardhat");
ZERO_HASH= "0x0000000000000000000000000000000000000000000000000000000000000000"
const sha3 = require('web3-utils').sha3;

module.exports = async ({getNamedAccounts, deployments, network}) => {
    const {deploy} = deployments;
    const {deployer, owner} = await getNamedAccounts();

    const ens = await ethers.getContract('ENSRegistry')

    await deploy('DefaultReverseResolver', {
        from: deployer, 
        args: [ens.address],
        log: true
    })

    const baseRegistrar = await ethers.getContract('BaseRegistrarImplementation')
    const controller = await ethers.getContract('ETHRegistrarController')
    const priceOracle = await ethers.getContract('StablePriceOracle')

    const transactions = []

    transactions.push(await ens.setSubnodeOwner(ZERO_HASH,sha3('pls'),controller.address));
    transactions.push(await baseRegistrar.addController(controller.address, {from: deployer}));
    // ESTIMATE GAS -->
    transactions.push(await controller.setPriceOracle(priceOracle.address, {from: deployer}));
    console.log(`Waiting on settings to take place on reverse-registrar ${transactions.length}`)
    // await Promise.all(transactions.map((tx) => tx.wait()));



}

module.exports.dependencies = ['registry', 'baseregistrar', 'eth-registrar']