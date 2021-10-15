const { assert } = require('chai')
const { expectRevert } = require('@openzeppelin/test-helpers')
const { web3 } = require('@openzeppelin/test-helpers/src/setup')

contract('RandomNumberConsumer', accounts => {
    const RandomNumberConsumer = artifacts.require('RandomNumberConsumer')
    const VRFCoordinatorMock = artifacts.require('VRFCoordinatorMock')
    const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
    const defaultAccount = accounts[0]
    let randomNumberConsumer, vrfCoordinatorMock, link, keyhash, fee

    describe('#request random number', () => {
        beforeEach(async () => {
            keyhash = '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4'
            fee = '1000000000000000000'
            link = await LinkToken.new({ from: defaultAccount })
            vrfCoordinatorMock = await VRFCoordinatorMock.new(link.address, { from: defaultAccount })
            randomNumberConsumer = await RandomNumberConsumer.new(link.address, keyhash, vrfCoordinatorMock.address, fee, { from: defaultAccount })
        })
        it('it revert without LINK', async () => {
            await expectRevert.unspecified(
                randomNumberConsumer.getRandomNumber({ from: defaultAccount })
            )
        })
        it('returns a random number with link', async () => {
            await link.transfer(randomNumberConsumer.address, web3.utils.toWei('1', 'ether'), { from: defaultAccount })
            let transaction = await randomNumberConsumer.getRandomNumber({ from: defaultAccount })
            assert.exists(transaction.receipt.rawLogs)
            // This is the event that is emitted
            let requestId = transaction.receipt.rawLogs[3].topics[0]
            // let requestId = await randomNumberConsumer.lastRequestId({ from: defaultAccount })
            await vrfCoordinatorMock.callBackWithRandomness(requestId, '777', randomNumberConsumer.address, { from: defaultAccount })
            let randomNumber = await randomNumberConsumer.randomResult({ from: defaultAccount })
            assert.equal(randomNumber, 777)
        })

        it('correctly makes the bet', async () => {
            await link.transfer(randomNumberConsumer.address, web3.utils.toWei('1', 'ether'), { from: defaultAccount })
            await web3.eth.sendTransaction({from: defaultAccount, to: randomNumberConsumer.address, value: web3.utils.toWei('20', 'ether')});
            let betTransaction = await randomNumberConsumer.bet(1, 1, { from: defaultAccount, value: web3.utils.toWei('1', 'ether') })
            assert.exists(betTransaction.receipt.rawLogs)
            // This is the event that is emitted
            assert.equal(betTransaction.logs[0].event, "BetEvent")
            assert.equal(betTransaction.logs[0].args[0], defaultAccount)
            assert.equal(betTransaction.logs[0].args[1], 1)
            assert.equal(betTransaction.logs[0].args[2], 0)
            assert.equal(betTransaction.logs[0].args[3], web3.utils.toWei('1', 'ether'))

            let players = await randomNumberConsumer.totalPlayers({ from: defaultAccount })
            assert.equal(players, 1);
        })

        it('pays the bet', async () => {
            await link.transfer(randomNumberConsumer.address, web3.utils.toWei('1', 'ether'), { from: defaultAccount })
            await web3.eth.sendTransaction({from: defaultAccount, to: randomNumberConsumer.address, value: web3.utils.toWei('20', 'ether')});
            let betTransaction = await randomNumberConsumer.bet(1, 1, { from: defaultAccount, value: web3.utils.toWei('1', 'ether') })
            let beforePayment = await web3.eth.getBalance(defaultAccount);

            assert.exists(betTransaction.receipt.rawLogs)
            assert.equal(betTransaction.logs[0].event, "BetEvent")

            let randomTransaction = await randomNumberConsumer.getRandomNumber({ from: defaultAccount })
            assert.exists(randomTransaction.receipt.rawLogs)
            // This is the event that is emitted
            let requestId = randomTransaction.receipt.rawLogs[3].topics[0]

            await vrfCoordinatorMock.callBackWithRandomness(requestId, '777', randomNumberConsumer.address, { from: defaultAccount })
            let randomNumber = await randomNumberConsumer.randomResult({ from: defaultAccount })
            let afterPayment = await web3.eth.getBalance(defaultAccount);
            console.log(web3.utils.toWei('18', 'ether') - (afterPayment - beforePayment))
            console.log(web3.utils.toWei('0.0001', 'ether'))

            //10^-3 because transactions use gas, so user wins 18 ethers but loses some eth in gas
            assert.isTrue(web3.utils.toWei('18', 'ether') - (afterPayment - beforePayment) <= web3.utils.toWei('0.001', 'ether'))
        })
    })
})
