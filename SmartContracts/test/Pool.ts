import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { CustomERC20Token, CustomERC20Token__factory, Pool, Pool__factory } from '../typechain-types';
import { BigNumber } from 'bignumber.js';

const FEE = 3000;
const INITIAL_LIQUIDITY_0 = 1000;
const INITIAL_LIQUIDITY_1 = 1000;
const SWAP_AMOUNT = 100;

describe('Pool', function () {
  const deployTokenAFixture = async () => {
    const CustomERC20Token: CustomERC20Token__factory = await ethers.getContractFactory('CustomERC20Token');
    const [owner, addr1, addr2] = await ethers.getSigners();
    const token: CustomERC20Token = await CustomERC20Token.deploy(
      owner,
      'CustomTokenA',
      'CTKA',
      1000,
      true,
      false,
      false,
      [],
      []
    );
    return { token, owner, addr1, addr2 };
  };

  const deployTokenBFixture = async () => {
    const CustomERC20Token: CustomERC20Token__factory = await ethers.getContractFactory('CustomERC20Token');
    const [owner, addr1, addr2] = await ethers.getSigners();
    const token: CustomERC20Token = await CustomERC20Token.deploy(
      owner,
      'CustomTokenB',
      'CTKB',
      1000,
      true,
      false,
      false,
      [],
      []
    );
    return { token, owner, addr1, addr2 };
  };

  const deployPoolFixture = async (tokenAAddress: string, tokenBAddress: string) => {
    const pool: Pool__factory = await ethers.getContractFactory('Pool');
    const [owner, addr1, addr2] = await ethers.getSigners();
    const poolInstance: Pool = await pool.deploy();
    await poolInstance.initialize(tokenAAddress, tokenBAddress, FEE);
    return { poolInstance, owner, addr1, addr2 };
  };

  const deployPoolWithTokensFixture = async () => {
    const { token: tokenA } = await loadFixture(deployTokenAFixture);
    const { token: tokenB } = await loadFixture(deployTokenBFixture);

    const tokenAAddress: string = await tokenA.getAddress();
    const tokenBAddress: string = await tokenB.getAddress();

    const { poolInstance, owner, addr1, addr2 } = await deployPoolFixture(tokenAAddress, tokenBAddress);

    return { poolInstance, tokenA, tokenB, owner, addr1, addr2 };
  };

  it('should initialize the Pool with correct parameters', async () => {
    const { poolInstance, tokenA, tokenB } = await loadFixture(deployPoolWithTokensFixture);

    const tokenAAddress = await tokenA.getAddress();
    const tokenBAddress = await tokenB.getAddress();

    expect(tokenAAddress).to.equal(await poolInstance.token0());
    expect(tokenBAddress).to.equal(await poolInstance.token1());
    expect(await poolInstance.fee()).to.equal(FEE);
  });

  it('should add liquidity successfully', async () => {
    const { poolInstance, tokenA, tokenB, addr1 } = await loadFixture(deployPoolWithTokensFixture);

    const poolAddress: string = await poolInstance.getAddress();

    // Transfer tokens to users
    await tokenA.transfer(addr1.address, INITIAL_LIQUIDITY_0);
    await tokenB.transfer(addr1.address, INITIAL_LIQUIDITY_1);

    // Approve tokens for transfer
    await tokenA.connect(addr1).approve(poolAddress, INITIAL_LIQUIDITY_0);
    await tokenB.connect(addr1).approve(poolAddress, INITIAL_LIQUIDITY_1);

    // Check allowances before adding liquidity
    const allowanceA = await tokenA.allowance(addr1.address, poolAddress);
    const allowanceB = await tokenB.allowance(addr1.address, poolAddress);
    expect(allowanceA).to.be.at.least(INITIAL_LIQUIDITY_0);
    expect(allowanceB).to.be.at.least(INITIAL_LIQUIDITY_1);

    // Check balances before adding liquidity
    const balanceA = await tokenA.balanceOf(addr1.address);
    const balanceB = await tokenB.balanceOf(addr1.address);
    expect(balanceA).to.be.equal(INITIAL_LIQUIDITY_0);
    expect(balanceB).to.be.equal(INITIAL_LIQUIDITY_1);

    // Add liquidity to the pool
    await poolInstance.connect(addr1).addLiquidity(INITIAL_LIQUIDITY_0, INITIAL_LIQUIDITY_1);

    expect(await poolInstance.reserve0()).to.equal(INITIAL_LIQUIDITY_0);
    expect(await poolInstance.reserve1()).to.equal(INITIAL_LIQUIDITY_1);
  });

  it('should fail to add liquidity if amounts are zero', async () => {
    const { poolInstance, addr1 } = await loadFixture(deployPoolWithTokensFixture);

    await expect(poolInstance.connect(addr1).addLiquidity(0, INITIAL_LIQUIDITY_1)).to.be.revertedWith(
      'Amounts must be greater than zero'
    );
    await expect(poolInstance.connect(addr1).addLiquidity(INITIAL_LIQUIDITY_0, 0)).to.be.revertedWith(
      'Amounts must be greater than zero'
    );
  });

  it('should remove liquidity successfully', async () => {
    const { poolInstance, tokenA, tokenB, addr1 } = await loadFixture(deployPoolWithTokensFixture);

    const poolAddress: string = await poolInstance.getAddress();

    // Transfer tokens to users
    await tokenA.transfer(addr1.address, INITIAL_LIQUIDITY_0);
    await tokenB.transfer(addr1.address, INITIAL_LIQUIDITY_1);

    // Approve tokens for transfer
    await tokenA.connect(addr1).approve(poolAddress, INITIAL_LIQUIDITY_0);
    await tokenB.connect(addr1).approve(poolAddress, INITIAL_LIQUIDITY_1);

    // Add liquidity to the pool
    await poolInstance.connect(addr1).addLiquidity(INITIAL_LIQUIDITY_0, INITIAL_LIQUIDITY_1);

    // Get reserves after adding liquidity
    const reserve0: bigint = await poolInstance.reserve0();
    const reserve1: bigint = await poolInstance.reserve1();

    // Calculate liquidity to remove based on the proportionality of reserves
    const totalLiquidity: BigNumber = new BigNumber(reserve0.toString()).plus(new BigNumber(reserve1.toString()));

    // Here, we are considering removing half of the provided liquidity as an example.
    const liquidityToRemove: BigNumber = totalLiquidity.dividedBy(2);

    // Remove liquidity
    await poolInstance.connect(addr1).removeLiquidity(liquidityToRemove.toFixed(0)); // Convert BigNumber to string

    // Get reserves after liquidity removal
    const reserve0After: bigint = await poolInstance.reserve0();
    const reserve1After: bigint = await poolInstance.reserve1();

    // Expected reserves after removing half the liquidity
    const expectedReserve0 = new BigNumber(reserve0.toString()).minus(liquidityToRemove.dividedBy(2));
    const expectedReserve1 = new BigNumber(reserve1.toString()).minus(liquidityToRemove.dividedBy(2));

    // Check if reserves are as expected
    expect(reserve0After.toString()).to.equal(expectedReserve0.toFixed(0));
    expect(reserve1After.toString()).to.equal(expectedReserve1.toFixed(0));
  });

  it('should fail to remove liquidity if amount is zero', async () => {
    const { poolInstance, addr1 } = await loadFixture(deployPoolWithTokensFixture);

    await expect(poolInstance.connect(addr1).removeLiquidity(0)).to.be.revertedWith(
      'Liquidity must be greater than zero'
    );
  });

  it('should fail to remove liquidity if no liquidity available', async () => {
    const { poolInstance, addr1 } = await loadFixture(deployPoolWithTokensFixture);

    await expect(poolInstance.connect(addr1).removeLiquidity(INITIAL_LIQUIDITY_0)).to.be.revertedWith(
      'No liquidity available'
    );
  });

  it('should execute a swap successfully', async () => {
    const { poolInstance, tokenA, tokenB, addr1, addr2 } = await loadFixture(deployPoolWithTokensFixture);

    const poolAddress: string = await poolInstance.getAddress();
    const tokenAAddress: string = await tokenA.getAddress();

    // Transfer tokens to user 1
    await tokenA.transfer(addr1.address, INITIAL_LIQUIDITY_0);
    await tokenB.transfer(addr1.address, INITIAL_LIQUIDITY_1);

    // Transfer tokens to user 2
    await tokenA.transfer(addr2.address, SWAP_AMOUNT);

    // Approve tokens for transfer
    await tokenA.connect(addr1).approve(poolAddress, INITIAL_LIQUIDITY_0);
    await tokenB.connect(addr1).approve(poolAddress, INITIAL_LIQUIDITY_1);

    // Add liquidity to the pool
    await poolInstance.connect(addr1).addLiquidity(INITIAL_LIQUIDITY_0, INITIAL_LIQUIDITY_1);

    // Approve tokens for swap
    await tokenA.connect(addr2).approve(poolAddress, SWAP_AMOUNT);

    // Calculate expected output based on current reserves and swap amount
    const reserve0BeforeSwap: bigint = await poolInstance.reserve0();
    const reserve1BeforeSwap: bigint = await poolInstance.reserve1();
    const amountInWithFee: number = SWAP_AMOUNT * (1000000 - FEE);
    const expectedAmountOut: bigint = BigInt(Math.floor((amountInWithFee * Number(reserve1BeforeSwap)) / (Number(reserve0BeforeSwap) * 1000000 + amountInWithFee)));

    // Swap token0 for token1
    await poolInstance.connect(addr2).swap(SWAP_AMOUNT, tokenAAddress, addr2.address);

    const reserve0AfterSwap: bigint = await poolInstance.reserve0();
    const reserve1AfterSwap: bigint = await poolInstance.reserve1();

    // Verify reserves after swap
    expect(reserve0AfterSwap).to.equal(reserve0BeforeSwap + BigInt(SWAP_AMOUNT));
    expect(reserve1AfterSwap).to.equal(reserve1BeforeSwap - expectedAmountOut);
  });

  it('should fail to execute a swap if amountIn is zero', async () => {
    const { poolInstance, addr1, tokenA } = await loadFixture(deployPoolWithTokensFixture);
    const tokenAAddress: string = await tokenA.getAddress();

    await expect(poolInstance.connect(addr1).swap(0, tokenAAddress, addr1.address)).to.be.revertedWith(
      'AmountIn must be greater than zero'
    );
  });

  it('should fail to execute a swap if recipient address is zero', async () => {
    const { poolInstance, addr1, tokenA } = await loadFixture(deployPoolWithTokensFixture);
    const tokenAAddress: string = await tokenA.getAddress();

    await expect(poolInstance.connect(addr1).swap(100, tokenAAddress, ethers.ZeroAddress)).to.be.revertedWith(
      'Invalid recipient address'
    );
  });
});
