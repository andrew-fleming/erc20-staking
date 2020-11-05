const DexquisiteToken = artifacts.require('DexquisiteToken')
const DaiToken = artifacts.require('DaiToken')
const DexquisiteCorpse = artifacts.require("DexquisiteCorpse")

module.exports = async function (deployer, network, accounts) {
    //deploy Mock Dai Token
    await deployer.deploy(DaiToken, '100000000000000000000')
    const daiToken = await DaiToken.deployed()

    //deploy Dexquisite Token
    await deployer.deploy(DexquisiteToken, '1000000000000000000000')
    const dexquisiteToken = await DexquisiteToken.deployed()

    //deploy Dexquisite Corpse Farm
    await deployer.deploy(DexquisiteCorpse, dexquisiteToken.address, daiToken.address)
    const dexquisiteCorpse = await DexquisiteCorpse.deployed()

    //transfer tokens to DexquisiteCorpse contract
    await dexquisiteToken.transfer(dexquisiteCorpse.address, '1000000000000000000000')
  

    //transfer 100 Mock Dai tokens to 'investor'
    await daiToken.transfer(accounts[1], '100000000000000000000')
};