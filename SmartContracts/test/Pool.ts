import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { CustomERC20Token, CustomERC20Token__factory, Pool, Pool__factory } from '../typechain-types';
import { BigNumber } from 'bignumber.js';
import { ContractTransactionResponse, ContractTransactionReceipt } from 'ethers';

const FEE = 3000;
const INITIAL_LIQUIDITY_0: bigint = ethers.parseUnits('100000', 'ether');
const INITIAL_LIQUIDITY_1: bigint = ethers.parseUnits('100000', 'ether');
const INITIAL_NATIVE_LIQUIDITY: bigint = ethers.parseUnits('1', 'ether');
const SWAP_AMOUNT: bigint = ethers.parseUnits('1', 'ether');

describe('Pool', function () {
  const deployTokenAFixture = async () => {
    const CustomERC20Token: CustomERC20Token__factory = await ethers.getContractFactory('CustomERC20Token');
    const [owner, addr1, addr2] = await ethers.getSigners();
    const token: CustomERC20Token = await CustomERC20Token.deploy(
      owner,
      'CustomTokenA',
      'CTKA',
      ethers.parseUnits('1000000', 'ether'),
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
      ethers.parseUnits('1000000', 'ether'),
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
    const poolInstance: Pool = await pool.connect(owner).deploy();
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

  const deployPoolWithNativeTokenFixture = async () => {
    const { token: tokenA } = await loadFixture(deployTokenAFixture);
    const tokenAAddress: string = await tokenA.getAddress();

    const { poolInstance, owner, addr1, addr2 } = await deployPoolFixture(ethers.ZeroAddress, tokenAAddress);

    return { poolInstance, tokenA, owner, addr1, addr2 };
  }

  it('should create a pool with the native token', async () => {
    const { token: tokenA } = await loadFixture(deployTokenAFixture);
    const tokenAAddress: string = await tokenA.getAddress();

    const { poolInstance } = await deployPoolWithNativeTokenFixture();

    expect(await poolInstance.token0()).to.equal(ethers.ZeroAddress);
    expect(await poolInstance.token1()).to.equal(tokenAAddress);
    expect(await poolInstance.fee()).to.equal(FEE);
  });

  it('should execute a swap successfully with ERC20 tokens', async () => {
    const { poolInstance, tokenA, tokenB, addr1, addr2, owner } = await loadFixture(deployPoolWithTokensFixture);
  
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
  
    // Calculate the amountOut manually using the same logic as the contract
    const amountInWithFee: bigint = BigInt(SWAP_AMOUNT) * BigInt(1000000 - FEE) / BigInt(1000000);
    const expectedAmountOut: bigint = (amountInWithFee * reserve1BeforeSwap) / (reserve0BeforeSwap + amountInWithFee);
  
    // Get addr2's balance before swap
    const addr2BalanceBeforeSwap: bigint = await tokenB.balanceOf(addr2.address);
  
    // Swap token0 for token1
    await poolInstance.connect(addr2).swap(SWAP_AMOUNT, tokenAAddress, addr2.address);
  
    const reserve0AfterSwap: bigint = await poolInstance.reserve0();
    const reserve1AfterSwap: bigint = await poolInstance.reserve1();
  
    // Verify reserves after swap
    expect(reserve0AfterSwap).to.equal(reserve0BeforeSwap + BigInt(SWAP_AMOUNT));
    expect(reserve1AfterSwap).to.equal(reserve1BeforeSwap - expectedAmountOut);
  
    // Get addr2's balance after swap
    const addr2BalanceAfterSwap: bigint = await tokenB.balanceOf(addr2.address);
  
    // Verify addr2's balance increased by the expected amount out
    expect(addr2BalanceAfterSwap).to.equal(addr2BalanceBeforeSwap + expectedAmountOut);
  });

  it('should execute a swap successfully with a native token', async () => {
    const { poolInstance, tokenA, addr1, addr2, owner } = await loadFixture(deployPoolWithNativeTokenFixture);
  
    const poolAddress: string = await poolInstance.getAddress();
    const tokenAAddress: string = await tokenA.getAddress();
  
    // Transfer tokens to user 1
    await tokenA.transfer(addr1.address, INITIAL_LIQUIDITY_1);
  
    // Transfer tokens to user 2
    await tokenA.transfer(addr2.address, SWAP_AMOUNT);
  
    // Approve tokens for transfer
    await tokenA.connect(addr1).approve(poolAddress, INITIAL_LIQUIDITY_1);
  
    // Add liquidity to the pool (Native token and TokenA)
    await poolInstance.connect(addr1).addLiquidity(INITIAL_NATIVE_LIQUIDITY, INITIAL_LIQUIDITY_1, { value: INITIAL_NATIVE_LIQUIDITY });
  
    // Approve tokens for swap
    await tokenA.connect(addr2).approve(poolAddress, SWAP_AMOUNT);
  
    // Calculate expected output based on current reserves and swap amount
    const reserve0BeforeSwap: bigint = await poolInstance.reserve0(); // Native token reserve
    const reserve1BeforeSwap: bigint = await poolInstance.reserve1(); // TokenA reserve
  
    // Calculate the amountOut manually using the same logic as the contract
    const amountInWithFee: bigint = BigInt(SWAP_AMOUNT) * BigInt(1000000 - FEE) / BigInt(1000000);
    const expectedAmountOut: bigint = (amountInWithFee * reserve0BeforeSwap) / (reserve1BeforeSwap + amountInWithFee);
  
    // Get addr2's balance of native token before swap
    const addr2BalanceBeforeSwap: bigint = await ethers.provider.getBalance(addr2.address);
  
    // Swap TokenA for native token
    const tx = await poolInstance.connect(addr2).swap(SWAP_AMOUNT, tokenAAddress, addr2.address);
    const receipt = await tx.wait();

    if(!receipt) return;
  
    // Calculate gas used and subtract from addr2's native token balance
    const gasUsed: bigint = BigInt(receipt.gasUsed) * BigInt(tx.gasPrice || 0);
    const addr2BalanceAfterGas: bigint = addr2BalanceBeforeSwap - gasUsed;
  
    const reserve0AfterSwap: bigint = await poolInstance.reserve0();
    const reserve1AfterSwap: bigint = await poolInstance.reserve1();
  
    // Verify reserves after swap
    expect(reserve0AfterSwap).to.equal(reserve0BeforeSwap - expectedAmountOut);
    expect(reserve1AfterSwap).to.equal(reserve1BeforeSwap + BigInt(SWAP_AMOUNT));
  
    // Get addr2's balance of native token after swap
    const addr2BalanceAfterSwap: bigint = await ethers.provider.getBalance(addr2.address);
  
    // Verify addr2's balance increased by the expected amount out (minus gas used)
    expect(addr2BalanceAfterSwap).to.equal(addr2BalanceAfterGas + expectedAmountOut);
  });

  it('should initialize the Pool with correct parameters', async () => {
    const { poolInstance, tokenA, tokenB } = await loadFixture(deployPoolWithTokensFixture);

    const tokenAAddress = await tokenA.getAddress();
    const tokenBAddress = await tokenB.getAddress();

    expect(tokenAAddress).to.equal(await poolInstance.token0());
    expect(tokenBAddress).to.equal(await poolInstance.token1());
    expect(await poolInstance.fee()).to.equal(FEE);
  });

  it('should add liquidity successfully with erc20 tokens', async () => {
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

  it('should add liquidity successfully with a native token', async () => {
    const { poolInstance, tokenA, addr1 } = await loadFixture(deployPoolWithNativeTokenFixture);
  
    const poolAddress: string = await poolInstance.getAddress();

    // Save initial native balance
    const nativeBalanceBefore: bigint = await ethers.provider.getBalance(addr1.address);

    // Save initial token balance
    const initialTokenBalance: bigint = await tokenA.balanceOf(addr1.address);

    // Utility function to calculate gas fees
    async function calculateGasUsedForTransaction(tx: ContractTransactionResponse, receipt: ContractTransactionReceipt): Promise<bigint> {
      const gasUsed = BigInt(receipt.gasUsed);
      const gasPrice = BigInt(tx.gasPrice);
      return gasUsed * gasPrice;
    }

    // Track total gas usage
    let totalGasUsed: bigint = BigInt(0);

    // Transfer tokens to user
    const transferTx = await tokenA.transfer(addr1.address, INITIAL_LIQUIDITY_1);
    const transferReceipt = await transferTx.wait();
    if(!transferReceipt) return;

    // Check token balance after transfer
    const tokenBalanceAfterTransfer: bigint = await tokenA.balanceOf(addr1.address);
    expect(tokenBalanceAfterTransfer).to.equal(initialTokenBalance + INITIAL_LIQUIDITY_1);
  
    // Approve TokenA for transfer
    const approveTx = await tokenA.connect(addr1).approve(poolAddress, INITIAL_LIQUIDITY_1);
    const approveReceipt = await approveTx.wait();
    if(!approveReceipt) return;
    totalGasUsed += await calculateGasUsedForTransaction(approveTx, approveReceipt);
    expect(await ethers.provider.getBalance(addr1.address)).to.equal(nativeBalanceBefore - totalGasUsed);

    // Check allowance after approve
    const allowanceAfterApprove: bigint = await tokenA.allowance(addr1.address, poolAddress);
    expect(allowanceAfterApprove).to.equal(INITIAL_LIQUIDITY_1);
  
    // Add liquidity to the pool (Native token and TokenA)
    const addLiquidityTx = await poolInstance.connect(addr1).addLiquidity(INITIAL_NATIVE_LIQUIDITY, INITIAL_LIQUIDITY_1, { value: INITIAL_NATIVE_LIQUIDITY });
    const addLiquidityReceipt = await addLiquidityTx.wait();
    if(!addLiquidityReceipt) return
    totalGasUsed += await calculateGasUsedForTransaction(addLiquidityTx, addLiquidityReceipt);

    // Check native balance after adding liquidity
    expect(await ethers.provider.getBalance(addr1.address)).to.equal(nativeBalanceBefore - totalGasUsed - INITIAL_NATIVE_LIQUIDITY);
  
    // Check pool reserves after adding liquidity
    const reserve0: bigint = await poolInstance.reserve0(); // Native token reserve
    const reserve1: bigint = await poolInstance.reserve1(); // TokenA reserve
  
    expect(reserve0).to.equal(INITIAL_NATIVE_LIQUIDITY);
    expect(reserve1).to.equal(INITIAL_LIQUIDITY_1);
  
    // Verify addr1's final balances
    const addr1NativeBalance: bigint = await ethers.provider.getBalance(addr1.address);
    const addr1TokenABalance: bigint = await tokenA.balanceOf(addr1.address);
  
    // Check that the remaining native token balance is correct after liquidity addition
    const expectedNativeBalance: bigint = BigInt(nativeBalanceBefore) - INITIAL_NATIVE_LIQUIDITY - totalGasUsed;
    expect(addr1NativeBalance).to.equal(expectedNativeBalance);
  
    // Check that the remaining TokenA balance is correct
    const expectedTokenABalance: bigint = tokenBalanceAfterTransfer - INITIAL_LIQUIDITY_1;
    expect(addr1TokenABalance).to.equal(expectedTokenABalance);
  });

  it('should remove liquidity successfully for ERC20 tokens', async () => {
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

  it('should remove liquidity successfully for a native token', async () => {
    const { poolInstance, tokenA, addr1 } = await loadFixture(deployPoolWithNativeTokenFixture);

    const poolAddress: string = await poolInstance.getAddress();

    // Save initial native balance
    const nativeBalanceBefore: bigint = await ethers.provider.getBalance(addr1.address);

    // Save initial token balance
    const initialTokenBalance: bigint = await tokenA.balanceOf(addr1.address);

    // Utility function to calculate gas fees
    async function calculateGasUsedForTransaction(tx: ContractTransactionResponse, receipt: ContractTransactionReceipt): Promise<bigint> {
      const gasUsed = BigInt(receipt.gasUsed);
      const gasPrice = BigInt(tx.gasPrice);
      return gasUsed * gasPrice;
    }

    // Track total gas usage
    let totalGasUsed: bigint = BigInt(0);

    // Transfer tokens to user
    const transferTx = await tokenA.transfer(addr1.address, INITIAL_LIQUIDITY_1);
    const transferReceipt = await transferTx.wait();
    if(!transferReceipt) return;

    // Check token balance after transfer
    const tokenBalanceAfterTransfer: bigint = await tokenA.balanceOf(addr1.address);
    expect(tokenBalanceAfterTransfer).to.equal(initialTokenBalance + INITIAL_LIQUIDITY_1);
  
    // Approve TokenA for transfer
    const approveTx: ContractTransactionResponse = await tokenA.connect(addr1).approve(poolAddress, INITIAL_LIQUIDITY_1);
    const approveReceipt: ContractTransactionReceipt | null = await approveTx.wait();
    if(!approveReceipt) return;
    totalGasUsed += await calculateGasUsedForTransaction(approveTx, approveReceipt);
    expect(await ethers.provider.getBalance(addr1.address)).to.equal(nativeBalanceBefore - totalGasUsed);

    // Check allowance after approve
    const allowanceAfterApprove: bigint = await tokenA.allowance(addr1.address, poolAddress);
    expect(allowanceAfterApprove).to.equal(INITIAL_LIQUIDITY_1);
  
    // Add liquidity to the pool (Native token and TokenA)
    const addLiquidityTx: ContractTransactionResponse = await poolInstance.connect(addr1).addLiquidity(INITIAL_NATIVE_LIQUIDITY, INITIAL_LIQUIDITY_1, { value: INITIAL_NATIVE_LIQUIDITY });
    const addLiquidityReceipt: ContractTransactionReceipt | null = await addLiquidityTx.wait();
    if(!addLiquidityReceipt) return
    totalGasUsed += await calculateGasUsedForTransaction(addLiquidityTx, addLiquidityReceipt);

    // Check native balance after adding liquidity
    expect(await ethers.provider.getBalance(addr1.address)).to.equal(nativeBalanceBefore - totalGasUsed - INITIAL_NATIVE_LIQUIDITY);

    // Get reserves after liquidity removal
    const reserve0After: bigint = await poolInstance.reserve0();
    const reserve1After: bigint = await poolInstance.reserve1();
    expect(reserve0After).to.equal(INITIAL_NATIVE_LIQUIDITY);
    expect(reserve1After).to.equal(INITIAL_LIQUIDITY_1);

    // Calculate liquidity to remove based on the proportionality of reserves
    const totalLiquidity: BigNumber = new BigNumber(reserve0After.toString()).plus(new BigNumber(reserve1After.toString()));

    // Remove liquidity
    const removeLiquidityTx: ContractTransactionResponse = await poolInstance.connect(addr1).removeLiquidity(totalLiquidity.toFixed(0)); // Convert BigNumber to string
    const removeLiquidityReceipt: ContractTransactionReceipt | null = await removeLiquidityTx.wait();
    if(!removeLiquidityReceipt) return
    totalGasUsed += await calculateGasUsedForTransaction(removeLiquidityTx, removeLiquidityReceipt);

    // // Check native balance after removing liquidity
    const nativeBalanceAfter: bigint = await ethers.provider.getBalance(addr1.address);
    expect(nativeBalanceBefore).to.equal(nativeBalanceAfter + totalGasUsed);
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

  it('should fail if the approval is not enough', async () => {
    const { poolInstance, addr1, tokenA, tokenB } = await loadFixture(deployPoolWithTokensFixture);
    const tokenAAddress: string = await tokenA.getAddress();
    const poolAddress: string = await poolInstance.getAddress();

    await expect(poolInstance.connect(addr1).swap(2000, tokenAAddress, addr1.address)).to.be.revertedWithCustomError(
      tokenA,
      'ERC20InsufficientAllowance'
    );

    // Transfer and approve tokens for addr1
    await tokenA.transfer(addr1.address, 2000);
    await tokenB.transfer(addr1.address, 100);
    await tokenA.connect(addr1).approve(poolAddress, 2000);
    await tokenB.connect(addr1).approve(poolAddress, 100);

    // Add a small amount of liquidity to create an insufficient liquidity scenario
    await poolInstance.connect(addr1).addLiquidity(50, 50); // Small amounts of liquidity

    // Try to swap an amount larger than the pool can handle
    await poolInstance.connect(addr1).swap(1000, tokenAAddress, addr1.address);
  });

  it('should fail if a user is not authorized to withdraw the liquidity', async () => {
    const { poolInstance, tokenA, tokenB, addr1, addr2 } = await loadFixture(deployPoolWithTokensFixture);

    const poolAddress: string = await poolInstance.getAddress();

    await tokenA.transfer(addr1.address, INITIAL_LIQUIDITY_0);
    await tokenB.transfer(addr1.address, INITIAL_LIQUIDITY_1);

    await tokenA.connect(addr1).approve(poolAddress, INITIAL_LIQUIDITY_0);
    await tokenB.connect(addr1).approve(poolAddress, INITIAL_LIQUIDITY_1);

    await poolInstance.connect(addr1).addLiquidity(INITIAL_LIQUIDITY_0, INITIAL_LIQUIDITY_1);

    await expect(poolInstance.connect(addr2).removeLiquidity(INITIAL_LIQUIDITY_0)).to.be.revertedWith(
      'No liquidity provided by user'
    );
  });

  it('should execute 3 different users adding liquidity, removing liquidity, and swapping', async () => {
    const { poolInstance, tokenA, tokenB, owner, addr1, addr2 } = await loadFixture(deployPoolWithTokensFixture);

    const poolAddress: string = await poolInstance.getAddress();

    // Transfer tokens to users
    await tokenA.transfer(addr1.address, INITIAL_LIQUIDITY_0);
    await tokenB.transfer(addr1.address, INITIAL_LIQUIDITY_1);
    await tokenA.transfer(addr2.address, INITIAL_LIQUIDITY_0);
    await tokenB.transfer(addr2.address, INITIAL_LIQUIDITY_1);
    await tokenA.transfer(owner.address, INITIAL_LIQUIDITY_0);
    await tokenB.transfer(owner.address, INITIAL_LIQUIDITY_1);

    // Approve tokens for transfer
    await tokenA.connect(addr1).approve(poolAddress, INITIAL_LIQUIDITY_0);
    await tokenB.connect(addr1).approve(poolAddress, INITIAL_LIQUIDITY_1);
    await tokenA.connect(addr2).approve(poolAddress, INITIAL_LIQUIDITY_0);
    await tokenB.connect(addr2).approve(poolAddress, INITIAL_LIQUIDITY_1);
    await tokenA.connect(owner).approve(poolAddress, INITIAL_LIQUIDITY_0);
    await tokenB.connect(owner).approve(poolAddress, INITIAL_LIQUIDITY_1);

    // Add liquidity to the pool
    await poolInstance.connect(addr1).addLiquidity(INITIAL_LIQUIDITY_0, INITIAL_LIQUIDITY_1);
    await poolInstance.connect(addr2).addLiquidity(INITIAL_LIQUIDITY_0, INITIAL_LIQUIDITY_1);
    await poolInstance.connect(owner).addLiquidity(INITIAL_LIQUIDITY_0, INITIAL_LIQUIDITY_1);

    // Users remove liquidity
    await poolInstance.connect(addr1).removeLiquidity(INITIAL_LIQUIDITY_0 / BigInt(2));
    await poolInstance.connect(addr2).removeLiquidity(INITIAL_LIQUIDITY_0 / BigInt(2));
    await poolInstance.connect(owner).removeLiquidity(INITIAL_LIQUIDITY_0 / BigInt(2));

    // User swaps
    await tokenA.connect(addr1).approve(poolAddress, SWAP_AMOUNT);
    await poolInstance.connect(addr1).swap(SWAP_AMOUNT, await tokenA.getAddress(), addr1.address);
    await tokenB.connect(addr2).approve(poolAddress, SWAP_AMOUNT);
    await poolInstance.connect(addr2).swap(SWAP_AMOUNT, await tokenB.getAddress(), addr2.address);
    await tokenA.connect(owner).approve(poolAddress, SWAP_AMOUNT);
    await poolInstance.connect(owner).swap(SWAP_AMOUNT, await tokenA.getAddress(), owner.address);
  });

});
