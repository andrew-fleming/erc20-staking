const { assert } = require('chai')
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

    describe('Dexquisite Token deployment', async() => {
        it('has a name', async () => {
            const name = await dexquisiteToken.name()
            assert.equal(name, 'Dexquisite')
        })
    })

    describe('Dexquisite Corpse', async() => {
        it('has a name', async() => {
            const name = await dexquisiteCorpse.name()
            assert.equal(name, 'Dexquisite Corpse')
        })

        it('contract has tokens', async() => {
            const balance = await dexquisiteToken.balanceOf(dexquisiteCorpse.address)
            assert.equal(balance.toString(), tokens('1000'))
        })
    })

    describe('Farming tokens', async() => {
        it('rewards investors for staking dai tokens', async() => {
            let result

            //check balance before staking
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor dai token balance not correct before staking')

            //check approval and staking
            await daiToken.approve(dexquisiteCorpse.address, tokens('100'), {from: investor})
            await dexquisiteCorpse.stake(tokens('100'), {from: investor})

            //check wallet balance of investor
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), '0', 'investor dai balance not correct after staking')

            //check that staking balance is correct
            result = await dexquisiteCorpse.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'), 'investor staking balance not correct after staking')
        
            //issue tokens
            await dexquisiteCorpse.issueTokens({from: owner})

            //check balance after issuance
            result = await dexquisiteToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'staking rewards balance not correct after issuance')

            //ensure only owner can issue tokens
            await dexquisiteCorpse.issueTokens({from: investor}).should.be.rejected
        })
    })

})