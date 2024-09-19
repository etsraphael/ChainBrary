import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { CrossChainDEX__factory, CustomERC20Token, CrossChainDEX, CustomERC20Token__factory } from '../typechain-types';

const LIQUIDITY_AMOUNT = 500;

describe('CrossChainDEX', function () {
  
  const deployTokenAFixture = async () => {
    const CustomERC20Token = await ethers.getContractFactory('CustomERC20Token');
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
    const [owner] = await ethers.getSigners();
    const dex: CrossChainDEX = await CrossChainDEX.deploy(ethers.ZeroAddress);
    return { dex };
  };

  it.only('Should allow users to add liquidity', async function () {
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
    expect(totalLiquidity).to.be.gt(0);

    // Check user1's liquidity balance
    const userLiquidity: bigint = await dex.liquidityProviderBalance(
      tokenA.getAddress(),
      tokenB.getAddress(),
      user1.address
    );
    expect(userLiquidity).to.equal(totalLiquidity);
  });

  it('Should allow users to remove liquidity', async function () {
    // ... test code ...
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
