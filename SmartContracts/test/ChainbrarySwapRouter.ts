import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { CustomERC20Token, CustomERC20Token__factory, Pool, Pool__factory, ChainbrarySwapRouter, ChainbrarySwapRouter__factory, ChainbrarySwapFactory, ChainbrarySwapFactory__factory } from '../typechain-types';
import { BigNumber } from 'bignumber.js';

const FEE = 3000;
const INITIAL_LIQUIDITY_0 = 100000;
const INITIAL_LIQUIDITY_1 = 100000;
const SWAP_AMOUNT = 100;
const DEST_CHAIN_SELECTOR = 1;

describe('ChainbrarySwapRouter', function () {
  async function deployRouterFixture() {
    const CustomERC20Token: CustomERC20Token__factory = await ethers.getContractFactory('CustomERC20Token');
    const Pool: Pool__factory = await ethers.getContractFactory('Pool');
    const ChainbrarySwapFactory: ChainbrarySwapFactory__factory = await ethers.getContractFactory('ChainbrarySwapFactory');
    const ChainbrarySwapRouter: ChainbrarySwapRouter__factory = await ethers.getContractFactory('ChainbrarySwapRouter');

    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy tokens
    const tokenA = await CustomERC20Token.deploy(owner.address, 'CustomTokenA', 'CTKA', 100000, true, false, false, [], []);
    const tokenB = await CustomERC20Token.deploy(owner.address, 'CustomTokenB', 'CTKB', 100000, true, false, false, [], []);

    // Deploy factory and router
    const factory = await ChainbrarySwapFactory.deploy();
    const factoryAddress: string = await factory.getAddress();
    const router = await ChainbrarySwapRouter.deploy();
    await router.initialize(factoryAddress, addr1.address); // Assume addr1 is used as the CCIP Router

    // Deploy a pool and register it in the factory
    const pool = await Pool.deploy();
    const tokenAAddress: string = await tokenA.getAddress();
    const tokenBAddress: string = await tokenB.getAddress();
    const poolAddress: string = await pool.getAddress();
    await pool.initialize(tokenAAddress, tokenBAddress, FEE);

    await factory.createPool(tokenAAddress, tokenBAddress, FEE);

    return { router, factory, pool, tokenA, tokenB, owner, addr1, addr2 };
  }

  it('should initialize the ChainbrarySwapRouter with correct parameters', async () => {
    const { router, factory } = await loadFixture(deployRouterFixture);

    const factoryAddress: string = await factory.getAddress();
    expect(await router.factory()).to.equal(factoryAddress);
  });

  it('should get the correct output amounts for a swap', async () => {
    const { router, tokenA, tokenB } = await loadFixture(deployRouterFixture);

    const tokenAAddress: string = await tokenA.getAddress();
    const tokenBAddress: string = await tokenB.getAddress();

    const path = [tokenAAddress, tokenBAddress];
    const fees = [FEE];
    const amountIn = 1000;

    const amountsOut = await router.getAmountsOut(amountIn, path, fees);
    expect(amountsOut.length).to.equal(2);
    expect(amountsOut[0]).to.equal(amountIn);
    expect(amountsOut[1]).to.be.gt(0); // Ensure output is greater than 0
  });

  it('should fail to get amounts out if path length is invalid', async () => {
    const { router, tokenA } = await loadFixture(deployRouterFixture);

    const tokenAAddress: string = await tokenA.getAddress();
    const path = [tokenAAddress]; // Invalid path, must be at least 2
    const fees = [FEE];
    const amountIn = 1000;

    await expect(router.getAmountsOut(amountIn, path, fees)).to.be.revertedWith('Invalid path');
  });

  it.only('should execute a token swap successfully', async () => {
    const { router, pool, tokenA, tokenB, addr1, addr2 } = await loadFixture(deployRouterFixture);

    const tokenAAddress: string = await tokenA.getAddress();
    const tokenBAddress: string = await tokenB.getAddress();

    const path: string[] = [tokenAAddress, tokenBAddress];
    const fees: number[] = [FEE];
    const amountIn: number = SWAP_AMOUNT;
    const amountOutMin: number = SWAP_AMOUNT + 1;
    const liquidity: number[] = [INITIAL_LIQUIDITY_0, INITIAL_LIQUIDITY_1];

    const routerAddress: string = await router.getAddress();  
    const poolAddress: string = await pool.getAddress();

    // Transfer tokens to addr1 and set approval and liquidity
    await tokenA.transfer(addr1.address, liquidity[0]);
    await tokenB.transfer(addr1.address, liquidity[1]);

    // Approve tokens for transfer
    await tokenA.connect(addr1).approve(poolAddress, liquidity[0]);
    await tokenB.connect(addr1).approve(poolAddress, liquidity[1]);

    // Add liquidity to the pool
    await pool.connect(addr1).addLiquidity(liquidity[0], liquidity[1]);

    // Get reserves 
    const reserve0BeforeSwap: bigint = await pool.reserve0();
    const reserve1BeforeSwap: bigint = await pool.reserve1();
    expect(reserve0BeforeSwap).to.be.equal(liquidity[0]);
    expect(reserve1BeforeSwap).to.be.equal(liquidity[1]);

    // set up addr2 with tokens
    await tokenA.transfer(addr2.address, amountIn);
    await tokenA.connect(addr2).approve(routerAddress, amountIn);

    // Get the output amount
    const amountInWithFee: number = SWAP_AMOUNT * (1000000 - FEE);
    const expectedAmountOut: bigint = BigInt(
      Math.floor(
        (amountInWithFee * Number(reserve1BeforeSwap)) / (Number(reserve0BeforeSwap) * 1000000 + amountInWithFee)
      )
    );
    const amountsOut: bigint[] = await router.connect(addr2).getAmountsOut(amountIn, path, fees);
    const amountOut: bigint = amountsOut[1];
    // expect(amountOut).to.be.equal(expectedAmountOut);
    console.log('amountOut', amountOut.toString());
    console.log('expectedAmountOut', expectedAmountOut.toString());


    

    // Execute the swap
    // await router.connect(addr2).swapExactTokensForTokens(amountIn, amountOutMin, path, fees, addr2.address);

    // const balanceAfter = await tokenB.balanceOf(addr1.address);
    // expect(balanceAfter).to.be.gt(0); // Ensure addr1 received tokens from the swap
  });

  it('should fail to execute a swap if output is less than minimum specified', async () => {
    const { router, tokenA, tokenB, addr1 } = await loadFixture(deployRouterFixture);

    const tokenAAddress: string = await tokenA.getAddress();
    const tokenBAddress: string = await tokenB.getAddress();

    const path = [tokenAAddress, tokenBAddress];
    const fees = [FEE];
    const amountIn = SWAP_AMOUNT;
    const amountOutMin = 10000; // Set too high to trigger failure

    await tokenA.transfer(addr1.address, amountIn);
    await tokenA.connect(addr1).approve(router.address, amountIn);

    await expect(
      router.connect(addr1).swapExactTokensForTokens(amountIn, amountOutMin, path, fees, addr1.address)
    ).to.be.revertedWith('Insufficient output amount');
  });

  it('should initiate a cross-chain swap', async () => {
    const { router, tokenA, tokenB, addr1 } = await loadFixture(deployRouterFixture);

    const tokenAAddress: string = await tokenA.getAddress();
    const tokenBAddress: string = await tokenB.getAddress();

    const path = [tokenAAddress, tokenBAddress];
    const fees = [FEE];
    const amountIn = SWAP_AMOUNT;
    const amountOutMin = 1;

    // Transfer tokens to addr1 and approve the router
    await tokenA.transfer(addr1.address, amountIn);
    await tokenA.connect(addr1).approve(router.address, amountIn);

    // Initiate the cross-chain swap
    await expect(
      router.connect(addr1).crossChainSwap(DEST_CHAIN_SELECTOR, path, fees, amountIn, amountOutMin, addr1.address, {
        value: ethers.parseEther('0.1'),
      })
    )
      .to.emit(router, 'CrossChainSwapInitiated')
      .withArgs(addr1.address, addr1.address); // Check that the event was emitted with correct arguments
  });

  it('should fail to initiate a cross-chain swap with insufficient fee', async () => {
    const { router, tokenA, tokenB, addr1 } = await loadFixture(deployRouterFixture);

    const tokenAAddress: string = await tokenA.getAddress();
    const tokenBAddress: string = await tokenB.getAddress();

    const path = [tokenAAddress, tokenBAddress];
    const fees = [FEE];
    const amountIn = SWAP_AMOUNT;
    const amountOutMin = 1;

    // Transfer tokens to addr1 and approve the router
    await tokenA.transfer(addr1.address, amountIn);
    await tokenA.connect(addr1).approve(router.address, amountIn);

    // Try to initiate the cross-chain swap with insufficient fee
    await expect(
      router.connect(addr1).crossChainSwap(DEST_CHAIN_SELECTOR, path, fees, amountIn, amountOutMin, addr1.address, {
        value: ethers.parseEther('0.001'),
      })
    ).to.be.revertedWith('Insufficient fee');
  });
});
