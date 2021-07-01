const { assert } = require("chai");
const _deploy_contracts = require("../migrations/2_deploy_contracts");

const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");
const TokenFarm = artifacts.require("TokenFarm");

require("chai")
.use(require("chai-as-promised"))
.should()

function tokens(n){
    return web3.utils.toWei(n, 'ether');
}

contract("TokenFarm", ([owner, investor]) => {
    let daiToken, dappToken, tokenFarm

    before(async () => {
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new();
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        await dappToken.transfer(tokenFarm.address, tokens('1000000'));


        await daiToken.transfer(investor, tokens('100'), {from: owner })
    })


    describe('Mock DAI Deployment', async () =>{

        it('has a name', async() => {
            const name = await daiToken.name();
            assert.equal(name, 'Mock DAI Token')
        })
    })

    describe('DApp Token Deployment', async () =>{

        it('has a name', async() => {
            const name = await dappToken.name();
            assert.equal(name, 'DApp Token')
        })
    })
    describe('Token Farm Deployment', async () =>{

        it('has a name', async() => {
            const name = await tokenFarm.name();
            assert.equal(name, 'DappTokenFarm')
        })

        it('contract has tokens', async() => {
            let balance = await dappToken.balanceOf(tokenFarm.address);
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('Farming Tokens', async() => {
        it('rewards investors for staking n Dai Tokens', async() => {
            let result, stakingBalance


            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Mock Dai wallet correct before staking');

            await daiToken.approve(tokenFarm.address, tokens('100'), {from: investor})
            await tokenFarm.stakeTokens(tokens('100'), {from: investor});

            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('0'), 'investor Mock Dai Wallet correct after staking')

            result = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(result.toString(), tokens('100'), 'investor Mock Dai Wallet correct after staking')

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'), 'investor staking balance correct in token farm')

            result = await tokenFarm.isStaking(investor);
            assert.equal(result.toString(), 'true', 'investor is currently staking in token farm');

            //issuing tokens

            await tokenFarm.issueTokens({from: owner} )

            result = await dappToken.balanceOf(investor);
            assert.equal(result, tokens('100'), 'investor Dapp token wallet correct after investing')

            await tokenFarm.issueTokens({from: investor}).should.be.rejected;

            await tokenFarm.unstakeTokens({from: investor})

            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), "tokens correctly put back into investors wallet")

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('0'), "token farm mock dai balance correct after staking")

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'false', "staking status properly updated")

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('0'), "staking balance properly updated after staking")

        })
    })

})