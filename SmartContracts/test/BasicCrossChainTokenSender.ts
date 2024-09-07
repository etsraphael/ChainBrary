import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import {
  BasicCrossChainTokenSender,
  BasicCrossChainTokenSender__factory,
  ChainbraryToken,
  ChainbraryToken__factory,
  MockingCcipRouter,
  MockingCcipRouter__factory,
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

    const token: ChainbraryToken = await chainbraryToken.deploy();
    await token.initialize(
      INITIAL_SUPPLY,
      OWNER_MINT_AMOUNT,
      mockV3Aggregator1.getAddress(),
      mockV3Aggregator2.getAddress(),
      mockV3Aggregator3.getAddress()
    );

    return { token, owner, addr1, addr2, mockV3Aggregator1, mockV3Aggregator2, mockV3Aggregator3 };
  };

  const deployMockingCcipRouterFixture = async () => {
    const mockingCcipRouter: MockingCcipRouter__factory = await ethers.getContractFactory('MockingCcipRouter');
    const mockingCcipRouterInstance: MockingCcipRouter = await mockingCcipRouter.deploy();
    return mockingCcipRouterInstance;
  }

  const deployBasicCrossChainTokenSenderFixture = async () => {
    const basicCrossChainTokenSender: BasicCrossChainTokenSender__factory = await ethers.getContractFactory('BasicCrossChainTokenSender');
    const basicCrossChainTokenSenderInstance: BasicCrossChainTokenSender = await basicCrossChainTokenSender.deploy();
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
    const deployMockingCcipRouter = await deployMockingCcipRouterFixture();
    const { token, owner, addr1 } = await loadFixture(deployChainbraryTokenFixture);
    const basicCrossChainTokenSender = await deployBasicCrossChainTokenSenderFixture();

    // Check initial balance before transfer
    expect(await token.balanceOf(owner.getAddress())).to.equal(ethers.parseUnits(OWNER_MINT_AMOUNT.toString(), DECIMAL));

    // Check if deployMockingCcipRouter was deployed successfully
    expect(await deployMockingCcipRouter.getAddress()).to.properAddress;

    const mockingCcipRouterAddress = await deployMockingCcipRouter.getAddress();

    const tokensToSendDetails = [
      {
        token: await token.getAddress(),
        amount: ethers.parseUnits('10', DECIMAL)
      }
    ];

    // Approve the BasicCrossChainTokenSender contract to spend the owner's tokens
    await token.connect(owner).approve(
      basicCrossChainTokenSender.getAddress(),
      tokensToSendDetails[0].amount
    );

    // use send function to transfer token, 
    await basicCrossChainTokenSender.connect(owner).send(
      mockingCcipRouterAddress,
      '6433500567565415381',
      await addr1.getAddress(), 
      tokensToSendDetails,
      { value: ethers.parseEther("1") }
    );

    // Check balance after transfer
    expect(await token.balanceOf(owner.getAddress())).to.equal(ethers.parseUnits((OWNER_MINT_AMOUNT - 10).toString(), DECIMAL));
  });


});
