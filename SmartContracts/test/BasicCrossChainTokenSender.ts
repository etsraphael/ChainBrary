import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import {
  ChainbraryToken,
  ChainbraryToken__factory,
  MockingPriceFeed,
  MockingPriceFeed__factory
} from '../typechain-types';

const INITIAL_SUPPLY = 21000000000;
const OWNER_MINT_AMOUNT = 150000000;
const DECIMAL = 18;

const TOKEN_1_PRICE = 50000;
const TOKEN_2_PRICE = 3000;
const TOKEN_3_PRICE = 600;

describe('BasicCrossChainTokenSender', function () {
  const deployChainbraryTokenFixture = async () => {
    const chainbraryToken: ChainbraryToken__factory = await ethers.getContractFactory('ChainbraryToken');
    const [owner, addr1, addr2] = await ethers.getSigners();

    // use MockV3Aggregator
    const MockV3Aggregator: MockingPriceFeed__factory = await ethers.getContractFactory('MockingPriceFeed');
    const mockV3Aggregator1: MockingPriceFeed = await MockV3Aggregator.deploy(DECIMAL, TOKEN_1_PRICE);
    const mockV3Aggregator2: MockingPriceFeed = await MockV3Aggregator.deploy(DECIMAL, TOKEN_2_PRICE);
    const mockV3Aggregator3: MockingPriceFeed = await MockV3Aggregator.deploy(DECIMAL, TOKEN_3_PRICE);

    const token = await chainbraryToken.deploy();
    await token.initialize(
      INITIAL_SUPPLY,
      OWNER_MINT_AMOUNT,
      mockV3Aggregator1.getAddress(),
      mockV3Aggregator2.getAddress(),
      mockV3Aggregator3.getAddress()
    );

    return { token, owner, addr1, addr2, mockV3Aggregator1, mockV3Aggregator2, mockV3Aggregator3 };
  };

  const deployBasicCrossChainTokenSenderFixture = async () => {
    const basicCrossChainTokenSender = await ethers.getContractFactory('BasicCrossChainTokenSender');
    const basicCrossChainTokenSenderInstance = await basicCrossChainTokenSender.deploy();
    return basicCrossChainTokenSenderInstance;
  };

  it('should deploy BasicCrossChainTokenSender and ChainbraryToken', async () => {
    const { token } = await loadFixture(deployChainbraryTokenFixture);
    expect(await token.name()).to.equal('ChainbraryToken');

    const basicCrossChainTokenSender = await deployBasicCrossChainTokenSenderFixture();

    // Check if BasicCrossChainTokenSender was deployed successfully
    expect(await basicCrossChainTokenSender.getAddress()).to.properAddress;
    expect(await ethers.provider.getCode(basicCrossChainTokenSender.getAddress())).to.not.equal('0x');

    // Optionally, check if a function exists
    expect(typeof basicCrossChainTokenSender.send).to.equal('function');
  });

  // "only" makes the test run only this test for now
  it.only('should use BasicCrossChainTokenSender to transfer the chainbrary token', async () => {
    const { token, owner, addr1 } = await loadFixture(deployChainbraryTokenFixture);
    const basicCrossChainTokenSender = await deployBasicCrossChainTokenSenderFixture();

    // Check initial balance before transfer
    expect(await token.balanceOf(owner.getAddress())).to.equal(ethers.parseUnits(OWNER_MINT_AMOUNT.toString(), DECIMAL) );

    /*  if we check inside of hardhat.config.ts we have two network right now, localnet1 and localnet2 
    but I'm not sure both are running with npm start
    */


    /*
        function send(
        address router,
        uint64 destinationChainSelector,
        address receiver,
        Client.EVMTokenAmount[] memory tokensToSendDetails
    )
     */

    const tokensToSendDetails = [
      {
        token: await token.getAddress(),
        amount: ethers.parseUnits(OWNER_MINT_AMOUNT.toString(), DECIMAL)
      }
    ];

    // use send function to transfer token, 
    await basicCrossChainTokenSender.send(
      '', // I don't know what to put here as "router"
      '', // I don't know what to put here as "destinationChainSelector"
      await addr1.getAddress(), 
      tokensToSendDetails
    );
  });


});
