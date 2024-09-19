import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { CrossChainDEX__factory, CustomERC20Token, CrossChainDEX, CustomERC20Token__factory } from '../typechain-types';

const LIQUIDITY_AMOUNT = 500;

describe('CrossChainDEX', function () {
  
  const deployTokenAFixture = async () => {
    const CustomERC20Token: CustomERC20Token__factory = await ethers.getContractFactory('CustomERC20Token');
    const [owner, addr1, addr2] = await ethers.getSigners();
    const token = await CustomERC20Token.deploy(owner, 'CustomTokenA', 'CTKA', 1000, true, false, false, [], []);
    return { token, owner, addr1, addr2 };
  };

  const deployTokenBFixture = async () => {
    const CustomERC20Token = await ethers.getContractFactory('CustomERC20Token');
    const [owner, addr1, addr2] = await ethers.getSigners();
    const token = await CustomERC20Token.deploy(owner, 'CustomTokenB', 'CTKB', 1000, true, false, false, [], []);
    return { token, owner, addr1, addr2 };
  };

  const deployCrossChainDEXFixture = async () => {
    const CrossChainDEX: CrossChainDEX__factory = await ethers.getContractFactory('CrossChainDEX');
    const dex: CrossChainDEX = await CrossChainDEX.deploy(ethers.ZeroAddress);
    return { dex };
  };

  it('Should allow users to add liquidity', async function () {
    // Deploy TokenA and TokenB
    const { token: tokenA } = await loadFixture(deployTokenAFixture);
    const { token: tokenB } = await loadFixture(deployTokenBFixture);

    // Deploy CrossChainDEX
    const { dex } = await loadFixture(deployCrossChainDEXFixture);

    // Get signers
    const [owner, user1] = await ethers.getSigners();

    // Transfer tokens to user1
    await tokenA.transfer(user1.address, LIQUIDITY_AMOUNT);
    await tokenB.transfer(user1.address, LIQUIDITY_AMOUNT);

    // Check user1's token balances
    expect(await tokenA.balanceOf(user1.address)).to.equal(LIQUIDITY_AMOUNT);
    expect(await tokenB.balanceOf(user1.address)).to.equal(LIQUIDITY_AMOUNT);

    // User1 approves the DEX to spend their tokens
    await tokenA.connect(user1).approve(dex.getAddress(), LIQUIDITY_AMOUNT);
    await tokenB.connect(user1).approve(dex.getAddress(), LIQUIDITY_AMOUNT);

    // User1 adds liquidity
    await expect(
      dex.connect(user1).addLiquidity(
        tokenA.getAddress(),
        tokenB.getAddress(),
        LIQUIDITY_AMOUNT,
        LIQUIDITY_AMOUNT
      )
    )
      .to.emit(dex, 'LiquidityAdded')
      .withArgs(
        user1.address,
        tokenA.getAddress(),
        tokenB.getAddress(),
        LIQUIDITY_AMOUNT,
        LIQUIDITY_AMOUNT,
        LIQUIDITY_AMOUNT
      );

    // Check the reserves
    const reserveA: bigint = await dex.reserves(tokenA.getAddress(), tokenB.getAddress());
    const reserveB: bigint = await dex.reserves(tokenB.getAddress(), tokenA.getAddress());

    expect(reserveA).to.equal(LIQUIDITY_AMOUNT);
    expect(reserveB).to.equal(LIQUIDITY_AMOUNT);

    // Check total liquidity
    const totalLiquidity = await dex.totalLiquidity(tokenA.getAddress(), tokenB.getAddress());
    expect(totalLiquidity).to.be.equal(LIQUIDITY_AMOUNT);

    // Check user1's liquidity balance
    const userLiquidity: bigint = await dex.liquidityProviderBalance(
      tokenA.getAddress(),
      tokenB.getAddress(),
      user1.address
    );
    expect(userLiquidity).to.equal(totalLiquidity);
  });

  it('Should allow users to remove liquidity', async function () {
    // Deploy TokenA and TokenB
    const { token: tokenA } = await loadFixture(deployTokenAFixture);
    const { token: tokenB } = await loadFixture(deployTokenBFixture);

    // Deploy CrossChainDEX
    const { dex } = await loadFixture(deployCrossChainDEXFixture);

    // Get signers
    const [owner, user1] = await ethers.getSigners();

    // Transfer tokens to user1
    await tokenA.transfer(user1.address, LIQUIDITY_AMOUNT);
    await tokenB.transfer(user1.address, LIQUIDITY_AMOUNT);

    // User1 approves the DEX to spend their tokens
    await tokenA.connect(user1).approve(dex.getAddress(), LIQUIDITY_AMOUNT);
    await tokenB.connect(user1).approve(dex.getAddress(), LIQUIDITY_AMOUNT);

    // User1 adds liquidity
    await dex.connect(user1).addLiquidity(
      tokenA.getAddress(),
      tokenB.getAddress(),
      LIQUIDITY_AMOUNT,
      LIQUIDITY_AMOUNT
    );

    // Get user1's liquidity balance
    const userLiquidity: bigint = await dex.liquidityProviderBalance(
      tokenA.getAddress(),
      tokenB.getAddress(),
      user1.address
    );

    // User1 removes liquidity
    await expect(
      dex.connect(user1).removeLiquidity(
        tokenA.getAddress(),
        tokenB.getAddress(),
        userLiquidity
      )
    )
      .to.emit(dex, 'LiquidityRemoved')
      .withArgs(
        user1.address,
        tokenA.getAddress(),
        tokenB.getAddress(),
        LIQUIDITY_AMOUNT,
        LIQUIDITY_AMOUNT,
        userLiquidity
      );

    // Check the reserves after removal
    const reserveA: bigint = await dex.reserves(tokenA.getAddress(), tokenB.getAddress());
    const reserveB: bigint = await dex.reserves(tokenB.getAddress(), tokenA.getAddress());

    expect(reserveA).to.equal(0);
    expect(reserveB).to.equal(0);

    // Check total liquidity after removal
    const totalLiquidity = await dex.totalLiquidity(tokenA.getAddress(), tokenB.getAddress());
    expect(totalLiquidity).to.equal(0);

    // Check user1's liquidity balance after removal
    const userLiquidityAfter: bigint = await dex.liquidityProviderBalance(
      tokenA.getAddress(),
      tokenB.getAddress(),
      user1.address
    );
    expect(userLiquidityAfter).to.equal(0);

    // Check user1's token balances after removal
    const userBalanceA = await tokenA.balanceOf(user1.address);
    const userBalanceB = await tokenB.balanceOf(user1.address);

    expect(userBalanceA).to.equal(LIQUIDITY_AMOUNT);
    expect(userBalanceB).to.equal(LIQUIDITY_AMOUNT);
  });

  it('Should allow users to swap tokens', async function () {
    // ... test code ...
  });

  it('Should provide correct quote for swapping tokens', async function () {
    // ... test code ...
  });

  it('Should fail swap if minimum amount out is not met (slippage)', async function () {
    // ... test code ...
  });

  it('Should fail to add liquidity with zero amounts', async function () {
    // ... test code ...
  });

  it('Should fail to remove liquidity if user has none', async function () {
    // ... test code ...
  });

  it('Should simulate cross-chain swap', async function () {
    // ... test code ...
  });
});
