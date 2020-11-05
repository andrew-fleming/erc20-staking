const { default: Web3 } = require('web3')

const DaiToken = artifacts.require('DaiToken')
const DexquisiteToken = artifacts.require('DexquisiteToken')
const DexquisiteCorpse = artifacts.require('DexquisiteCorpse') 

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
   return web3.utils.toWei(n, 'ether')
}

contract('DexquisiteCorpse', ([owner, investor]) => {
    let daiToken, dexquisiteToken, dexquisiteCorpse

    //recreate what happens in migration
    before( async() => {
        daiToken = await DaiToken.new(tokens('100'))
        dexquisiteToken = await DexquisiteToken.new(tokens('1000'))
        dexquisiteCorpse = await DexquisiteCorpse.new(dexquisiteToken.address, daiToken.address)

        //transfer dxq to dexquisite corpse farm
        await dexquisiteToken.transfer(dexquisiteCorpse.address, tokens('1000'))

        //transfer dai to investor
        await daiToken.transfer(investor, tokens('100'), {from: owner})

    })

    describe('Mock Dai deployment', async () => {
        it('has a name', async () => {
            const name = await daiToken.name()
            assert.equal(name, 'Dai')
        })
    })

})