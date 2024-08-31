import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { MockingPriceFeed, MockingPriceFeed__factory } from '../typechain-types';
import BigNumber from 'bignumber.js';
// import { MockingPriceFeed } from '../typechain-types';

const INITIAL_SUPPLY = 21000000000;
const OWNER_MINT_AMOUNT = 150000000;
const DECIMAL = 18;

const TOKEN_1 = '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c';
const TOKEN_2 = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419';
const TOKEN_3 = '0x14e613AC84a31f709eadbdF89C6CC390fDc9540A';

const TOKEN_1_PRICE = 50000;
const TOKEN_2_PRICE = 3000;
const TOKEN_3_PRICE = 600;

describe('ChainbraryToken', function () {

  const deployTokenFixture = async () => {
    const chainbraryToken = await ethers.getContractFactory('ChainbraryToken');
    const [owner, addr1, addr2] = await ethers.getSigners();

    // use MockV3Aggregator
    const MockV3Aggregator: MockingPriceFeed__factory = await ethers.getContractFactory('MockingPriceFeed');
    const mockV3Aggregator1: MockingPriceFeed = await MockV3Aggregator.deploy(DECIMAL, TOKEN_1_PRICE);
    const mockV3Aggregator2: MockingPriceFeed = await MockV3Aggregator.deploy(DECIMAL, TOKEN_2_PRICE);
    const mockV3Aggregator3: MockingPriceFeed = await MockV3Aggregator.deploy(DECIMAL, TOKEN_3_PRICE);

    const token = await chainbraryToken.deploy(INITIAL_SUPPLY, OWNER_MINT_AMOUNT, mockV3Aggregator1, mockV3Aggregator2, mockV3Aggregator3);
    return { token, owner, addr1, addr2, mockV3Aggregator1, mockV3Aggregator2, mockV3Aggregator3 };
  };

  it('Should return the correct name and symbol', async function () {
    const { token } = await loadFixture(deployTokenFixture);
    expect(await token.name()).to.equal('ChainbraryToken');
    expect(await token.symbol()).to.equal('CBT');
  });

  it('Should mint the correct initial supply to owner and contract', async function () {
    const { token, owner } = await loadFixture(deployTokenFixture);
    const ownerBalance = await token.balanceOf(owner.address);
    const contractBalance = await token.balanceOf(token.getAddress());
    const totalSupply = await token.totalSupply();

    expect(ownerBalance).to.equal(ethers.parseUnits(OWNER_MINT_AMOUNT.toString(), DECIMAL));
    expect(contractBalance).to.equal(ethers.parseUnits((INITIAL_SUPPLY - OWNER_MINT_AMOUNT).toString(), DECIMAL));
    expect(totalSupply).to.equal(ethers.parseUnits(INITIAL_SUPPLY.toString(), DECIMAL));
  });

  it.only('Get median price of 3 tokens', async function () {
    const { token, mockV3Aggregator1, mockV3Aggregator2, mockV3Aggregator3 } = await loadFixture(deployTokenFixture);
    const mockAggregators: MockingPriceFeed[] = [mockV3Aggregator1, mockV3Aggregator2, mockV3Aggregator3];
    const expectedPrices: bigint[] = [TOKEN_1_PRICE, TOKEN_2_PRICE, TOKEN_3_PRICE].map(price => ethers.parseUnits(price.toString(), DECIMAL));
  
    await Promise.all(
      mockAggregators.map(async (aggregator: MockingPriceFeed, index: number) => {
        const price = await token.getPrice(await aggregator.getAddress());
        expect(price).to.equal(expectedPrices[index]);
      })
    );

    const paymentAmount: bigint = ethers.parseUnits('1');
    const tokenAmount: bigint = await token.getCBTokenAmountWithMedian(paymentAmount);
    
    const medianPrice: bigint = [...expectedPrices].sort((a, b) => (a > b ? 1 : -1))[1];
    const expectedTokenAmount: bigint = paymentAmount * BigInt(1e18) / medianPrice;
    
    expect(tokenAmount).to.equal(expectedTokenAmount);

  });
});
