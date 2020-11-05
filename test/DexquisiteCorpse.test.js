const DaiToken = artifacts.require('DaiToken')
const DexquisiteToken = artifacts.require('DexquisiteToken')
const DexquisiteCorpse = artifacts.require('DexquisiteCorpse') 

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('DexquisiteCorpse', (accounts) => {

    describe('Mock Dai deployment', async () => {
        it('has a name', async () => {
            let daiToken = await DaiToken.new('100000000000000000000')
            const name = await daiToken.name()
            assert.equal(name, 'Dai')
        })
    })

})