import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ContractTransactionReceipt, ContractTransactionResponse, EventLog, Log, LogDescription } from 'ethers';
import { ethers } from 'hardhat';
import {
  ChainbrarySwapFactory,
  ChainbrarySwapFactory__factory,
  ChainbrarySwapRouter,
  ChainbrarySwapRouter__factory,
  CustomERC20Token,
  CustomERC20Token__factory,
  Pool,
  Pool__factory
} from '../typechain-types';
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

const FEE = 100;
const INITIAL_LIQUIDITY_0: bigint = ethers.parseUnits('100000', 'ether');
const INITIAL_LIQUIDITY_1: bigint = ethers.parseUnits('100000', 'ether');
const SWAP_AMOUNT: bigint = ethers.parseUnits('1', 'ether');
const MIN_AMOUNT_OUT: bigint = ethers.parseUnits('0.5', 'ether');
const DEST_CHAIN_SELECTOR = 1;

describe('ChainbrarySwapRouter', function () {

  const getPoolFromFactory = async (factory: ChainbrarySwapFactory, tokenA: CustomERC20Token, tokenB: CustomERC20Token, addr: HardhatEthersSigner): Promise<Pool> => {
    const tokenAAddress: string = await tokenA.getAddress();
    const tokenBAddress: string = await tokenB.getAddress();
    const factoryPool = await factory.getPool(tokenAAddress, tokenBAddress, FEE);
    return Pool__factory.connect(factoryPool, addr);
  }

  const getPoolFromPoolContract = async (poolAddress: string, addr: HardhatEthersSigner): Promise<Pool> => {
    return Pool__factory.connect(poolAddress, addr);
  }

  const fillUpLiquidity = async (pool: Pool, amount: bigint, tokenA: CustomERC20Token, tokenB: CustomERC20Token, addr: HardhatEthersSigner) => {
    const poolAddress = await pool.getAddress();

    // Transfer tokens to addr and set approval
    await tokenA.transfer(addr.address, amount);
    await tokenB.transfer(addr.address, amount);
    await tokenA.connect(addr).approve(poolAddress, amount);
    await tokenB.connect(addr).approve(poolAddress, amount);


    await tokenA.transfer(addr.address, amount);
    await tokenB.transfer(addr.address, amount);

    await tokenA.connect(addr).approve(poolAddress, amount);
    await tokenB.connect(addr).approve(poolAddress, amount);

    await pool.connect(addr).addLiquidity(amount, amount);
  }

  async function deployRouterFixture() {
    const CustomERC20Token: CustomERC20Token__factory = await ethers.getContractFactory('CustomERC20Token');
    const ChainbrarySwapFactory: ChainbrarySwapFactory__factory =
      await ethers.getContractFactory('ChainbrarySwapFactory');
    const ChainbrarySwapRouter: ChainbrarySwapRouter__factory = await ethers.getContractFactory('ChainbrarySwapRouter');

    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy tokens
    const tokenA: CustomERC20Token = await CustomERC20Token.deploy(
      owner.address,
      'CustomTokenA',
      'CTKA',
      ethers.parseUnits('1000000', 'ether'),
      true,
      false,
      false,
      [],
      []
    );
    const tokenB: CustomERC20Token = await CustomERC20Token.deploy(
      owner.address,
      'CustomTokenB',
      'CTKB',
      ethers.parseUnits('1000000', 'ether'),
      true,
      false,
      false,
      [],
      []
    );

    // Deploy factory and router
    const factory: ChainbrarySwapFactory = await ChainbrarySwapFactory.deploy();
    const factoryAddress: string = await factory.getAddress();
    const router: ChainbrarySwapRouter = await ChainbrarySwapRouter.deploy();
    await router.initialize(factoryAddress, addr1.address);

    // Deploy a pool from the factory
    const tokenAAddress: string = await tokenA.getAddress();
    const tokenBAddress: string = await tokenB.getAddress();

    // Listen for the PoolCreated event and create a pool
    const tx: ContractTransactionResponse = await factory.createPool(tokenAAddress, tokenBAddress, FEE);
    const receipt: ContractTransactionReceipt | null = await tx.wait();

    if(!receipt) { 
      throw new Error('Transaction receipt not found');
    }

    // Extract the pool address from the event
    const poolCreatedEvent: LogDescription | null | undefined = receipt.logs
      .map((log: EventLog | Log) => factory.interface.parseLog(log))
      .find((event: LogDescription | null) => event?.name === 'PoolCreated');
    if (!poolCreatedEvent) {
      throw new Error('PoolCreated event not found');
    }

    const poolAddress: string = poolCreatedEvent.args?.pool;

    return { router, factory, poolAddress, tokenA, tokenB, owner, addr1, addr2 };
  }

  it('should find the correct pool address', async () => {
    const { factory, tokenA, tokenB, poolAddress, addr1 } = await loadFixture(deployRouterFixture);

    const tokenAAddress: string = await tokenA.getAddress();
    const tokenBAddress: string = await tokenB.getAddress();

    // Get the pool address from the factory
    const poolInstanceFromFactory: Pool = await getPoolFromFactory(factory, tokenA, tokenB, addr1);
    const poolAddressFromFactory: string = await poolInstanceFromFactory.getAddress();
    expect(poolAddress).to.equal(poolAddressFromFactory);
    expect(tokenAAddress).to.equal(await poolInstanceFromFactory.token0());
    expect(tokenBAddress).to.equal(await poolInstanceFromFactory.token1());

    // Get pool from Pool contract 
    const poolInstanceFromPoolContract: Pool = await getPoolFromPoolContract(poolAddress, addr1);
    const poolAddressFromPoolContract: string = await poolInstanceFromPoolContract.getAddress();
    expect(poolAddress).to.equal(poolAddressFromPoolContract);
    expect(tokenAAddress).to.equal(await poolInstanceFromPoolContract.token0());
    expect(tokenBAddress).to.equal(await poolInstanceFromPoolContract.token1());

    // Check if the pool addresses are the same
    expect(poolAddressFromFactory).to.equal(poolAddressFromPoolContract);
  
    // Check if the tokens are the same
    expect(await poolInstanceFromPoolContract.token0()).to.equal(await poolInstanceFromFactory.token0());
    expect(await poolInstanceFromPoolContract.token1()).to.equal(await poolInstanceFromFactory.token1());

  });

  it('should initialize the ChainbrarySwapRouter with correct parameters', async () => {
    const { router, factory } = await loadFixture(deployRouterFixture);

    const factoryAddress: string = await factory.getAddress();
    expect(await router.factory()).to.equal(factoryAddress);
  });

  it('should get an error message if reserve is empty', async () => {
    const { router, tokenA, tokenB, addr1 } = await loadFixture(deployRouterFixture);

    const tokenAAddress: string = await tokenA.getAddress();
    const tokenBAddress: string = await tokenB.getAddress();

    const path = [tokenAAddress, tokenBAddress];
    const fees = [FEE];
    const amountIn = SWAP_AMOUNT;

    await expect(router.connect(addr1).getAmountsOut(amountIn, path, fees)).to.be.revertedWith(
      'Invalid reserves'
    );
  });

  it('should fail to get amounts out if path length is invalid', async () => {
    const { router, tokenA } = await loadFixture(deployRouterFixture);

    const tokenAAddress: string = await tokenA.getAddress();
    const path = [tokenAAddress]; // Invalid path, must be at least 2
    const fees = [FEE];
    const amountIn = 1000;

    await expect(router.getAmountsOut(amountIn, path, fees)).to.be.revertedWith('Invalid path');
  });

  it('should execute a token swap successfully', async () => {
    const { router, factory, poolAddress, tokenA, tokenB, addr1, addr2 } = await loadFixture(deployRouterFixture);

    const tokenAAddress: string = await tokenA.getAddress();
    const tokenBAddress: string = await tokenB.getAddress();
    const poolForAddr1: Pool = await getPoolFromPoolContract(poolAddress, addr1);

    const path: string[] = [tokenAAddress, tokenBAddress];
    const fees: number[] = [FEE];
    const amountIn: bigint = SWAP_AMOUNT; // Increase the swap amount
    const amountOutMin: number = 1; // Set to 1 to ensure the output is greater than zero
    const liquidity: bigint[] = [INITIAL_LIQUIDITY_0, INITIAL_LIQUIDITY_1];

    const routerAddress: string = await router.getAddress();

    // Check token addresses
    expect(tokenAAddress).to.equal(await poolForAddr1.token0());
    expect(tokenBAddress).to.equal(await poolForAddr1.token1());

    // Transfer tokens to addr1 and set approval and liquidity
    await tokenA.transfer(addr1.address, liquidity[0]);
    await tokenB.transfer(addr1.address, liquidity[1]);

    // Approve tokens for transfer
    await tokenA.connect(addr1).approve(poolAddress, liquidity[0]);
    await tokenB.connect(addr1).approve(poolAddress, liquidity[1]);

    // Add liquidity to the pool
    const addLiquidityTx = await poolForAddr1.connect(addr1).addLiquidity(liquidity[0], liquidity[1]);
    await addLiquidityTx.wait();

    // Get reserves
    const reserve0BeforeSwap: bigint = await poolForAddr1.reserve0();
    const reserve1BeforeSwap: bigint = await poolForAddr1.reserve1();
    const fee: bigint = await poolForAddr1.fee();
    expect(reserve0BeforeSwap).to.be.equal(BigInt(liquidity[0]));
    expect(reserve1BeforeSwap).to.be.equal(BigInt(liquidity[1]));
    expect(fee).to.be.equal(BigInt(FEE));

    // Check if pool was created from factory
    expect(await factory.getPool(tokenAAddress, tokenBAddress, FEE)).to.equal(poolAddress);
  
    // Set up addr2 with tokens
    await tokenA.transfer(addr2.address, amountIn);
    await tokenA.connect(addr2).approve(routerAddress, amountIn);
  
    // Calculate the amountOut manually using the same logic as the contract
    const amountInWithFee: bigint = BigInt(amountIn) * BigInt(1000000 - FEE) / BigInt(1000000);
    const expectedAmountOut: bigint = (amountInWithFee * reserve1BeforeSwap) / (reserve0BeforeSwap + amountInWithFee);
  
    // Get the output amounts from the router contract
    const routerInstance: ChainbrarySwapRouter = ChainbrarySwapRouter__factory.connect(routerAddress, addr2);
    const amountsOut: bigint[] = await routerInstance.getAmountsOut(amountIn, path, fees);
    const amountOut: bigint = amountsOut[1];

    // Compare manual calculation with the contract result
    expect(amountsOut[1]).to.be.equal(expectedAmountOut);

    const balanceBefore: bigint = await tokenB.balanceOf(addr2.address);
    expect(balanceBefore).to.be.equal(0);
  
    // Execute the swap if the above calculations are consistent
    await router.connect(addr2).swapExactTokensForTokens(amountIn, amountOutMin, path, fees, addr2.address);
  
    // Check balances after swap
    const balanceAfter: bigint = await tokenB.balanceOf(addr2.address);
    expect(balanceAfter).to.be.equal(expectedAmountOut);
  });

  it('should fail to execute a swap if output is less than minimum specified', async () => {
    const { factory, router, tokenA, tokenB, addr1 } = await loadFixture(deployRouterFixture);

    // fill up liquidity
    const pool: Pool = await getPoolFromFactory(factory, tokenA, tokenB, addr1);
    await fillUpLiquidity(pool, SWAP_AMOUNT, tokenA, tokenB, addr1);

    const tokenAAddress: string = await tokenA.getAddress();
    const tokenBAddress: string = await tokenB.getAddress();
    const routerAddress: string = await router.getAddress();

    const path: string[] = [tokenAAddress, tokenBAddress];
    const fees: number[] = [FEE];
    const amountIn: bigint = SWAP_AMOUNT;
    const amountOutMin: bigint = SWAP_AMOUNT;

    await tokenA.transfer(addr1.address, amountIn);
    await tokenA.connect(addr1).approve(routerAddress, amountIn);

    await expect(
      router.connect(addr1).swapExactTokensForTokens(amountIn, amountOutMin, path, fees, addr1.address)
    ).to.be.revertedWith('Insufficient output amount');
  });

});
