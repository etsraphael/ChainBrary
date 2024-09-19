import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { BigNumberish } from 'ethers';
import { ethers } from 'hardhat';
import { CrossChainDEX, CrossChainDEX__factory, CustomERC20Token, CustomERC20Token__factory, MockingCcipRouter, MockingCcipRouter__factory } from '../typechain-types';
import { Client } from '../typechain-types/contracts/BasicCrossChainTokenSender';

const LIQUIDITY_AMOUNT = 500;
const DECIMALS = 18;

describe('CrossChainDEX', function () {
  const sqrt = (value: BigNumberish): bigint => {
    let x = BigInt(value);
    if (x === 0n || x === 1n) {
      return x;
    }
    let z = x / 2n + 1n;
    let y = x;
    while (z < y) {
      y = z;
      z = (x / z + z) / 2n;
    }
    return y;
  }

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

  const deployCrossChainDEXFixture = async () => {
    const mockingCcipRouter: MockingCcipRouter__factory = await ethers.getContractFactory('MockingCcipRouter');
    const mockingCcipRouterInstance: MockingCcipRouter = await mockingCcipRouter.deploy();
    const CrossChainDEX: CrossChainDEX__factory = await ethers.getContractFactory('CrossChainDEX');
    const dex: CrossChainDEX = await CrossChainDEX.deploy(await mockingCcipRouterInstance.getAddress());
    return { dex, mockingCcipRouterInstance };
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

    const amountA = BigInt(LIQUIDITY_AMOUNT);
    const amountB = BigInt(LIQUIDITY_AMOUNT);
    const expectedLiquidity = sqrt(amountA * amountB);

    // User1 adds liquidity
    await expect(
      dex.connect(user1).addLiquidity(tokenA.getAddress(), tokenB.getAddress(), LIQUIDITY_AMOUNT, LIQUIDITY_AMOUNT)
    )
      .to.emit(dex, 'LiquidityAdded')
      .withArgs(
        user1.address,
        tokenA.getAddress(),
        tokenB.getAddress(),
        LIQUIDITY_AMOUNT,
        LIQUIDITY_AMOUNT,
        ethers.toBigInt(expectedLiquidity)
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
    await dex.connect(user1).addLiquidity(tokenA.getAddress(), tokenB.getAddress(), LIQUIDITY_AMOUNT, LIQUIDITY_AMOUNT);

    // Get user1's liquidity balance
    const userLiquidity: bigint = await dex.liquidityProviderBalance(
      tokenA.getAddress(),
      tokenB.getAddress(),
      user1.address
    );

    // User1 removes liquidity
    await expect(dex.connect(user1).removeLiquidity(tokenA.getAddress(), tokenB.getAddress(), userLiquidity))
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
    // Deploy TokenA and TokenB
    const { token: tokenA } = await loadFixture(deployTokenAFixture);
    const { token: tokenB } = await loadFixture(deployTokenBFixture);
  
    // Deploy CrossChainDEX
    const { dex } = await loadFixture(deployCrossChainDEXFixture);
  
    // Get signers
    const [owner, user1, user2] = await ethers.getSigners();
  
  
    // User1 adds liquidity
    await tokenA.transfer(user1.address, LIQUIDITY_AMOUNT);
    await tokenB.transfer(user1.address, LIQUIDITY_AMOUNT);
    await tokenA.connect(user1).approve(dex.getAddress(), LIQUIDITY_AMOUNT);
    await tokenB.connect(user1).approve(dex.getAddress(), LIQUIDITY_AMOUNT);
    await dex.connect(user1).addLiquidity(
      tokenA.getAddress(),
      tokenB.getAddress(),
      LIQUIDITY_AMOUNT,
      LIQUIDITY_AMOUNT
    );
  
    // Transfer tokens to user2
    const swapAmount = ethers.parseUnits('100', DECIMALS);
    await tokenA.transfer(user2.address, swapAmount);
    await tokenA.connect(user2).approve(dex.getAddress(), swapAmount);
  
    // Get reserves
    const reserveIn = await dex.reserves(tokenA.getAddress(), tokenB.getAddress());
    const reserveOut = await dex.reserves(tokenB.getAddress(), tokenA.getAddress());
  
    // Calculate expected amountOut
    const FEE_NUMERATOR = 997n;
    const FEE_DENOMINATOR = 1000n;
    const amountInWithFee = BigInt(swapAmount) * FEE_NUMERATOR;
    const numerator = amountInWithFee * BigInt(reserveOut);
    const denominator = BigInt(reserveIn) * FEE_DENOMINATOR + amountInWithFee;
    const expectedAmountOut = numerator / denominator;
  
    // User2 swaps TokenA for TokenB
    await expect(
      dex.connect(user2).swap(
        tokenA.getAddress(),
        tokenB.getAddress(),
        swapAmount,
        0
      )
    )
      .to.emit(dex, 'SwapExecuted')
      .withArgs(
        user2.address,
        tokenA.getAddress(),
        tokenB.getAddress(),
        swapAmount,
        ethers.toBigInt(expectedAmountOut) // Use the calculated expected amountOut
      );
  
    // Check user2's token balances
    const userBalanceA = await tokenA.balanceOf(user2.address);
    const userBalanceB = await tokenB.balanceOf(user2.address);
  
    expect(userBalanceA).to.equal(0); // They swapped all TokenA
    expect(userBalanceB).to.equal(expectedAmountOut); // They should have received expected TokenB
  
    // Check reserves
    const reserveA = await dex.reserves(tokenA.getAddress(), tokenB.getAddress());
    const reserveB = await dex.reserves(tokenB.getAddress(), tokenA.getAddress());
  
    expect(reserveA).to.equal(BigInt(reserveIn) + BigInt(swapAmount)); // Original + swapped amount
    expect(reserveB).to.equal(BigInt(reserveOut) - expectedAmountOut); // Original - amount given to user2
  });

  it('Should provide correct quote for swapping tokens', async function () {
    // Deploy TokenA and TokenB
    const { token: tokenA } = await loadFixture(deployTokenAFixture);
    const { token: tokenB } = await loadFixture(deployTokenBFixture);
  
    // Deploy CrossChainDEX
    const { dex } = await loadFixture(deployCrossChainDEXFixture);
  
    // Get signers
    const [owner, user1] = await ethers.getSigners();
  
    const DECIMALS = 18;
    const LIQUIDITY_AMOUNT = ethers.parseUnits('500', DECIMALS);
  
    // User1 adds liquidity
    await tokenA.transfer(user1.address, LIQUIDITY_AMOUNT);
    await tokenB.transfer(user1.address, LIQUIDITY_AMOUNT);
    await tokenA.connect(user1).approve(dex.getAddress(), LIQUIDITY_AMOUNT);
    await tokenB.connect(user1).approve(dex.getAddress(), LIQUIDITY_AMOUNT);
    await dex.connect(user1).addLiquidity(
      tokenA.getAddress(),
      tokenB.getAddress(),
      LIQUIDITY_AMOUNT,
      LIQUIDITY_AMOUNT
    );
  
    // Get a quote for swapping 100 TokenA to TokenB
    const amountIn = ethers.parseUnits('100', DECIMALS);
    const amountOut = await dex.getQuote(
      tokenA.getAddress(),
      tokenB.getAddress(),
      amountIn
    );
  
    // Manually calculate expected amountOut
    const reserveIn = await dex.reserves(tokenA.getAddress(), tokenB.getAddress());
    const reserveOut = await dex.reserves(tokenB.getAddress(), tokenA.getAddress());
  
    const FEE_NUMERATOR = 997n;
    const FEE_DENOMINATOR = 1000n;
    const amountInWithFee = BigInt(amountIn) * FEE_NUMERATOR;
    const numerator = amountInWithFee * BigInt(reserveOut);
    const denominator = BigInt(reserveIn) * FEE_DENOMINATOR + amountInWithFee;
    const expectedAmountOut = numerator / denominator;
  
    expect(amountOut).to.equal(expectedAmountOut);
  });

  it('Should fail to remove liquidity if user has none', async function () {
    // Deploy TokenA and TokenB
    const { token: tokenA } = await loadFixture(deployTokenAFixture);
    const { token: tokenB } = await loadFixture(deployTokenBFixture);
  
    // Deploy CrossChainDEX
    const { dex } = await loadFixture(deployCrossChainDEXFixture);
  
    // Get signers
    const [owner, user1] = await ethers.getSigners();
  
    // User1 attempts to remove liquidity without adding any
    const liquidityAmount = ethers.parseUnits('100', DECIMALS);
    await expect(
      dex.connect(user1).removeLiquidity(
        tokenA.getAddress(),
        tokenB.getAddress(),
        liquidityAmount
      )
    ).to.be.revertedWith('No liquidity in pool');
  });

  it('Should simulate cross-chain swap', async function () {
    // Deploy TokenA
    const { token: tokenA } = await loadFixture(deployTokenAFixture);
    const { dex } = await loadFixture(deployCrossChainDEXFixture);
  
    // Get signers
    const [owner, user1] = await ethers.getSigners();
  
    // Transfer tokens to user1
    const tokenAmount = ethers.parseUnits('100', DECIMALS);
    await tokenA.transfer(user1.address, tokenAmount);
    await tokenA.connect(user1).approve(dex.getAddress(), tokenAmount);
  
    // Prepare tokensToSendDetails using Client.EVMTokenAmount
    const tokensToSendDetails: Client.EVMTokenAmountStruct[] = [
      {
        token: tokenA.getAddress(),
        amount: tokenAmount,
      },
    ];

    // Simulate crossChainSwap
    await expect(
      dex.connect(user1).crossChainSwap(
        1, // Destination chain selector (dummy value)
        await user1.getAddress(),
        tokensToSendDetails,
        { value: ethers.parseEther("1") } // give some random fees values for now
      )
    ).to.emit(dex, 'CrossChainSwapInitiated');
  });

  it('Should fail swap if minimum amount out is not met (slippage)', async function () {
    // Deploy TokenA and TokenB
    const { token: tokenA } = await loadFixture(deployTokenAFixture);
    const { token: tokenB } = await loadFixture(deployTokenBFixture);
  
    // Deploy CrossChainDEX
    const { dex } = await loadFixture(deployCrossChainDEXFixture);
  
    // Get signers
    const [owner, user1, user2] = await ethers.getSigners();
  
    // User1 adds liquidity
    await tokenA.transfer(user1.address, LIQUIDITY_AMOUNT);
    await tokenB.transfer(user1.address, LIQUIDITY_AMOUNT);
    await tokenA.connect(user1).approve(dex.getAddress(), LIQUIDITY_AMOUNT);
    await tokenB.connect(user1).approve(dex.getAddress(), LIQUIDITY_AMOUNT);
    await dex.connect(user1).addLiquidity(
      tokenA.getAddress(),
      tokenB.getAddress(),
      LIQUIDITY_AMOUNT,
      LIQUIDITY_AMOUNT
    );
  
    // User2 wants to swap tokens
    const swapAmount = ethers.parseUnits('100', DECIMALS);
    await tokenA.transfer(user2.address, swapAmount);
    await tokenA.connect(user2).approve(dex.getAddress(), swapAmount);
  
    // Get the expected amountOut
    const amountOut = await dex.getQuote(tokenA.getAddress(), tokenB.getAddress(), swapAmount);
  
    // Set minAmountOut higher than the expected amountOut to simulate slippage
    const minAmountOut = amountOut + ethers.parseUnits('1', DECIMALS);
  
    // User2 attempts to swap with minAmountOut higher than amountOut
    await expect(
      dex.connect(user2).swap(
        tokenA.getAddress(),
        tokenB.getAddress(),
        swapAmount,
        minAmountOut
      )
    ).to.be.revertedWith('Slippage tolerance exceeded');
  });
  
  it('Should fail to add liquidity with zero amounts', async function () {
    // Deploy TokenA and TokenB
    const { token: tokenA } = await loadFixture(deployTokenAFixture);
    const { token: tokenB } = await loadFixture(deployTokenBFixture);
  
    // Deploy CrossChainDEX
    const { dex } = await loadFixture(deployCrossChainDEXFixture);
  
    // Get signers
    const [owner, user1] = await ethers.getSigners();
  
    // User1 has tokens
    const tokenAmount = ethers.parseUnits('100', DECIMALS);
    await tokenA.transfer(user1.address, tokenAmount);
    await tokenB.transfer(user1.address, tokenAmount);
    await tokenA.connect(user1).approve(dex.getAddress(), tokenAmount);
    await tokenB.connect(user1).approve(dex.getAddress(), tokenAmount);
  
    // Attempt to add liquidity with zero amountA
    await expect(
      dex.connect(user1).addLiquidity(
        tokenA.getAddress(),
        tokenB.getAddress(),
        0,
        tokenAmount
      )
    ).to.be.revertedWith('Invalid amounts');
  
    // Attempt to add liquidity with zero amountB
    await expect(
      dex.connect(user1).addLiquidity(
        tokenA.getAddress(),
        tokenB.getAddress(),
        tokenAmount,
        0
      )
    ).to.be.revertedWith('Invalid amounts');
  
    // Attempt to add liquidity with both amounts zero
    await expect(
      dex.connect(user1).addLiquidity(
        tokenA.getAddress(),
        tokenB.getAddress(),
        0,
        0
      )
    ).to.be.revertedWith('Invalid amounts');
  });
  
  it('Should fail to remove liquidity if user has none', async function () {
    // Deploy TokenA and TokenB
    const { token: tokenA } = await loadFixture(deployTokenAFixture);
    const { token: tokenB } = await loadFixture(deployTokenBFixture);
  
    // Deploy CrossChainDEX
    const { dex } = await loadFixture(deployCrossChainDEXFixture);
  
    // Get signers
    const [owner, user1, user2] = await ethers.getSigners();
  
    // User1 adds liquidity
    await tokenA.transfer(user1.address, LIQUIDITY_AMOUNT);
    await tokenB.transfer(user1.address, LIQUIDITY_AMOUNT);
    await tokenA.connect(user1).approve(dex.getAddress(), LIQUIDITY_AMOUNT);
    await tokenB.connect(user1).approve(dex.getAddress(), LIQUIDITY_AMOUNT);
    await dex.connect(user1).addLiquidity(
      tokenA.getAddress(),
      tokenB.getAddress(),
      LIQUIDITY_AMOUNT,
      LIQUIDITY_AMOUNT
    );
  
    // User2 attempts to remove liquidity without adding any
    const liquidityAmount = ethers.parseUnits('100', DECIMALS);
    await expect(
      dex.connect(user2).removeLiquidity(
        tokenA.getAddress(),
        tokenB.getAddress(),
        liquidityAmount
      )
    ).to.be.revertedWith('Insufficient liquidity balance');
  });

});
