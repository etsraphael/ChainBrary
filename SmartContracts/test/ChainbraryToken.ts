import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ChainbraryToken, MockingPriceFeed, MockingPriceFeed__factory } from '../typechain-types';
import BigNumber from 'bignumber.js';
// import { MockingPriceFeed } from '../typechain-types';

const INITIAL_SUPPLY = 21000000000;
const OWNER_MINT_AMOUNT = 150000000;
const DECIMAL = 18;

const TOKEN_1_PRICE = 50000;
const TOKEN_2_PRICE = 3000;
const TOKEN_3_PRICE = 600;

describe('ChainbraryToken', function () {
  async function calculateExpectedTokenAmount(token: ChainbraryToken, paymentAmount: bigint, expectedPrices: bigint[]) {
    // Calculate the average price
    const totalPrices: bigint = expectedPrices.reduce((a: bigint, b: bigint) => a + b, BigInt(0));
    const averagePrice: bigint = totalPrices / BigInt(expectedPrices.length);

    // Calculate the time elapsed in days since deployment
    const currentBlock = await ethers.provider.getBlock('latest');
    if (!currentBlock) {
      throw new Error('No block');
    }
    const timeElapsed: bigint = BigInt(currentBlock.timestamp) / BigInt(86400); // 86400 seconds in a day

    // Calculate the exponential multiplier
    const exponentialMultiplier: bigint =
      (BigInt(10 ** DECIMAL) * (BigInt(1) + timeElapsed) ** BigInt(2)) / BigInt(1e6);

    // Apply the exponential multiplier to the average price
    const adjustedPrice: bigint = (averagePrice * exponentialMultiplier) / BigInt(10 ** DECIMAL);

    // Calculate the expected token amount
    const expectedTokenAmount: bigint = (paymentAmount * BigInt(10 ** DECIMAL)) / adjustedPrice;

    return expectedTokenAmount;
  }

  const deployTokenFixture = async () => {
    const chainbraryToken = await ethers.getContractFactory('ChainbraryToken');
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

  it('Should get exponential price of 3 tokens', async function () {
    const { token, mockV3Aggregator1, mockV3Aggregator2, mockV3Aggregator3 } = await loadFixture(deployTokenFixture);
    const mockAggregators = [mockV3Aggregator1, mockV3Aggregator2, mockV3Aggregator3];
    const expectedPrices = [TOKEN_1_PRICE, TOKEN_2_PRICE, TOKEN_3_PRICE].map((price) =>
      ethers.parseUnits(price.toString(), DECIMAL)
    );

    await Promise.all(
      mockAggregators.map(async (aggregator, index) => {
        const price = await token.getPrice(await aggregator.getAddress());
        expect(price).to.equal(expectedPrices[index]);
      })
    );

    const paymentAmount = ethers.parseUnits('1');
    const tokenAmount = await token.getExponentialPrice(paymentAmount);

    // Calculate the expected token amount using the updated function
    const expectedTokenAmount = await calculateExpectedTokenAmount(token, paymentAmount, expectedPrices);

    expect(tokenAmount).to.equal(expectedTokenAmount);
});
  it('Should respect the max purchase limit', async function () {
    const { token, addr1 } = await loadFixture(deployTokenFixture);
    const amount: bigint = ethers.parseUnits('2000', DECIMAL);

    await expect(token.connect(addr1).buyTokens(amount, { value: amount })).to.be.revertedWith(
      'Purchase exceeds max limit'
    );
  });

  it('Should allow user to use buyTokens function and get the correct amount of tokens', async function () {
    const { token, addr1, mockV3Aggregator1, mockV3Aggregator2, mockV3Aggregator3 } =
      await loadFixture(deployTokenFixture);

    const mockAggregators = [mockV3Aggregator1, mockV3Aggregator2, mockV3Aggregator3];
    const expectedPrices = [TOKEN_1_PRICE, TOKEN_2_PRICE, TOKEN_3_PRICE].map((price) =>
      ethers.parseUnits(price.toString(), DECIMAL)
    );

    const paymentAmount = ethers.parseUnits('1', 'ether');
    const tokenAmount = await calculateExpectedTokenAmount(token, paymentAmount, expectedPrices);

    const initialBalance = await token.balanceOf(addr1.address);
    expect(initialBalance).to.equal(0);

    await token.connect(addr1).buyTokens(tokenAmount, { value: paymentAmount });

    const finalBalance = await token.balanceOf(addr1.address);
    expect(finalBalance).to.equal(initialBalance + tokenAmount);

    // Check that the contract's balance decreased by the correct amount
    const contractBalance = await token.balanceOf(token.getAddress());
    expect(contractBalance).to.equal(
      (await token.totalSupply()) - finalBalance - (await token.balanceOf(token.owner()))
    );
  });

  it('Should allow owner to withdraw funds received', async function () {
    const { token, owner, addr1, mockV3Aggregator1, mockV3Aggregator2, mockV3Aggregator3 } =
      await loadFixture(deployTokenFixture);

    const mockAggregators = [mockV3Aggregator1, mockV3Aggregator2, mockV3Aggregator3];
    const expectedPrices = [TOKEN_1_PRICE, TOKEN_2_PRICE, TOKEN_3_PRICE].map((price) =>
      ethers.parseUnits(price.toString(), DECIMAL)
    );

    // Send some ether to the contract by buying tokens
    const paymentAmount = ethers.parseUnits('1', 'ether');
    await token
      .connect(addr1)
      .buyTokens(await calculateExpectedTokenAmount(token, paymentAmount, expectedPrices), { value: paymentAmount });

    const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
    const initialContractBalance = await ethers.provider.getBalance(token.getAddress());

    // Withdraw the funds from the contract
    const tx = await token.connect(owner).withdrawFunds(initialContractBalance);
    const receipt = await tx.wait();

    if (!receipt) {
      throw new Error('No receipt');
    }
    const gasUsed = receipt.gasUsed * tx.gasPrice;

    const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
    const finalContractBalance = await ethers.provider.getBalance(token.getAddress());

    expect(finalContractBalance).to.equal(BigInt(0));
    expect(finalOwnerBalance).to.equal(initialOwnerBalance + initialContractBalance - gasUsed);
  });

  it('Should not allow owner to withdraw funds if contract does not have enough tokens', async function () {
    const { token, owner } = await loadFixture(deployTokenFixture);

    const contractBalance: bigint = await ethers.provider.getBalance(token.getAddress());
    expect(contractBalance).to.equal(0);

    const amount: bigint = ethers.parseUnits('1', 'ether');

    await expect(token.connect(owner).withdrawFunds(amount)).to.be.revertedWith('Insufficient balance');
  });

  it('Should restrict withdrawals to the owner only', async function () {
    const { token, addr1, addr2, mockV3Aggregator1, mockV3Aggregator2, mockV3Aggregator3 } =
      await loadFixture(deployTokenFixture);

    const mockAggregators = [mockV3Aggregator1, mockV3Aggregator2, mockV3Aggregator3];
    const expectedPrices = [TOKEN_1_PRICE, TOKEN_2_PRICE, TOKEN_3_PRICE].map((price) =>
      ethers.parseUnits(price.toString(), DECIMAL)
    );

    // Send some ether to the contract by buying tokens
    const paymentAmount = ethers.parseUnits('1', 'ether');
    await token
      .connect(addr2)
      .buyTokens(await calculateExpectedTokenAmount(token, paymentAmount, expectedPrices), { value: paymentAmount });

    const contractBalance = await ethers.provider.getBalance(token.getAddress());

    await expect(token.connect(addr1).withdrawFunds(contractBalance)).to.be.revertedWithCustomError(
      token,
      'OwnableUnauthorizedAccount'
    );
  });

  it('Should update price feeds after the lock period', async function () {
    const { token, owner, mockV3Aggregator1, mockV3Aggregator2, mockV3Aggregator3 } =
      await loadFixture(deployTokenFixture);

    const MockV3Aggregator: MockingPriceFeed__factory = await ethers.getContractFactory('MockingPriceFeed');
    const newMockV3Aggregator1: MockingPriceFeed = await MockV3Aggregator.deploy(DECIMAL, 45000);
    const newMockV3Aggregator2: MockingPriceFeed = await MockV3Aggregator.deploy(DECIMAL, 3200);
    const newMockV3Aggregator3: MockingPriceFeed = await MockV3Aggregator.deploy(DECIMAL, 700);

    await ethers.provider.send('evm_increaseTime', [14 * 24 * 60 * 60]); // increase time by 14 days
    await ethers.provider.send('evm_mine', []); // mine a new block

    await token
      .connect(owner)
      .updatePriceFeeds(
        newMockV3Aggregator1.getAddress(),
        newMockV3Aggregator2.getAddress(),
        newMockV3Aggregator3.getAddress()
      );

    const updatedPrice1 = await token.getPrice(newMockV3Aggregator1.getAddress());
    const updatedPrice2 = await token.getPrice(newMockV3Aggregator2.getAddress());
    const updatedPrice3 = await token.getPrice(newMockV3Aggregator3.getAddress());

    expect(updatedPrice1).to.equal(ethers.parseUnits('45000', DECIMAL));
    expect(updatedPrice2).to.equal(ethers.parseUnits('3200', DECIMAL));
    expect(updatedPrice3).to.equal(ethers.parseUnits('700', DECIMAL));
  });

  it('Should not allow updating price feeds before the lock period', async function () {
    const { token, owner, mockV3Aggregator1, mockV3Aggregator2, mockV3Aggregator3 } =
      await loadFixture(deployTokenFixture);

    const MockV3Aggregator: MockingPriceFeed__factory = await ethers.getContractFactory('MockingPriceFeed');
    const newMockV3Aggregator1: MockingPriceFeed = await MockV3Aggregator.deploy(DECIMAL, 45000);
    const newMockV3Aggregator2: MockingPriceFeed = await MockV3Aggregator.deploy(DECIMAL, 3200);
    const newMockV3Aggregator3: MockingPriceFeed = await MockV3Aggregator.deploy(DECIMAL, 700);

    await expect(
      token
        .connect(owner)
        .updatePriceFeeds(
          newMockV3Aggregator1.getAddress(),
          newMockV3Aggregator2.getAddress(),
          newMockV3Aggregator3.getAddress()
        )
    ).to.be.revertedWith('Update locked for 2 weeks');
  });

  it('Should not allow setting max purchase limit before the lock period', async function () {
    const { token, owner } = await loadFixture(deployTokenFixture);

    const newMaxPurchaseLimit: bigint = ethers.parseUnits('1500', DECIMAL);

    await expect(token.connect(owner).setMaxPurchaseLimit(newMaxPurchaseLimit)).to.be.revertedWith(
      'Update locked for 2 weeks'
    );
  });

  it('Should allow setting max purchase limit after the lock period', async function () {
    const { token, owner } = await loadFixture(deployTokenFixture);

    const newMaxPurchaseLimit: bigint = ethers.parseUnits('1500', DECIMAL);

    await ethers.provider.send('evm_increaseTime', [14 * 24 * 60 * 60]); // increase time by 14 days
    await ethers.provider.send('evm_mine', []); // mine a new block

    await expect(token.connect(owner).setMaxPurchaseLimit(newMaxPurchaseLimit))
      .to.emit(token, 'MaxPurchaseLimitUpdated')
      .withArgs(newMaxPurchaseLimit);

    const updatedMaxPurchaseLimit = await token.maxPurchaseLimit();
    expect(updatedMaxPurchaseLimit).to.equal(newMaxPurchaseLimit);
  });

  it('Should not allow setting weekly withdrawal limit before the lock period', async function () {
    const { token, owner } = await loadFixture(deployTokenFixture);

    const newWeeklyWithdrawalLimit: bigint = ethers.parseUnits('200', DECIMAL);

    await expect(token.connect(owner).setWeeklyWithdrawalLimit(newWeeklyWithdrawalLimit)).to.be.revertedWith(
      'Update locked for 2 weeks'
    );
  });

  it('Should allow setting weekly withdrawal limit after the lock period', async function () {
    const { token, owner } = await loadFixture(deployTokenFixture);

    const newWeeklyWithdrawalLimit: bigint = ethers.parseUnits('200', DECIMAL);

    await ethers.provider.send('evm_increaseTime', [14 * 24 * 60 * 60]); // increase time by 14 days
    await ethers.provider.send('evm_mine', []); // mine a new block

    await expect(token.connect(owner).setWeeklyWithdrawalLimit(newWeeklyWithdrawalLimit))
      .to.emit(token, 'WeeklyWithdrawalLimitUpdated')
      .withArgs(newWeeklyWithdrawalLimit);

    const updatedWeeklyWithdrawalLimit = await token.weeklyWithdrawalLimit();
    expect(updatedWeeklyWithdrawalLimit).to.equal(newWeeklyWithdrawalLimit);
  });
});
