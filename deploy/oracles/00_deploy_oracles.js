const { ethers } = require("hardhat");

module.exports = async ({getNamedAccounts, deployments, network}) => {
    const {deploy} = deployments;
    const {deployer, owner} = await getNamedAccounts();
    const oracle = await deploy('DummyOracle', {
        from: deployer, 
        args:[1000],
        log:true
    })

    await deploy('StablePriceOracle', {
        from: deployer, 
        args:[oracle.address,[1]],
        log:true
    })
    

}

module.exports.tags = ['oracles'];
module.exports.dependencies = ['registry']