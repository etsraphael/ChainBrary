import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import {
  Pool,
  Pool__factory
} from '../typechain-types';

const TOKEN_1_ADDRESS = '0x0000000000000000000000000000000000000001';
const TOKEN_2_ADDRESS = '0x0000000000000000000000000000000000000002';
const FEE = 3000;
const INITIAL_LIQUIDITY_0 = 1000;
const INITIAL_LIQUIDITY_1 = 2000;

describe('Pool', function () {
  const deployPoolFixture = async () => {
    const pool: Pool__factory = await ethers.getContractFactory('Pool');
    const [owner, addr1, addr2] = await ethers.getSigners();
    const poolInstance: Pool = await pool.deploy();
    await poolInstance.initialize(TOKEN_1_ADDRESS, TOKEN_2_ADDRESS, FEE);
    return { poolInstance, owner, addr1, addr2 };
  };

  it('should initialize the Pool with correct parameters', async () => {
    const { poolInstance } = await loadFixture(deployPoolFixture);

    expect(await poolInstance.token0()).to.equal(TOKEN_1_ADDRESS);
    expect(await poolInstance.token1()).to.equal(TOKEN_2_ADDRESS);
    expect(await poolInstance.fee()).to.equal(FEE);
  });

//   it('should add liquidity successfully', async () => {
//     const { poolInstance, owner } = await loadFixture(deployPoolFixture);

//     // Mint initial liquidity tokens to owner
//     await ethers.provider.send('hardhat_setBalance', [owner.address, '0x3635C9ADC5DEA00000']); // Set balance to 1000 ether

//     // Add liquidity to the pool
//     await poolInstance.connect(owner).addLiquidity(INITIAL_LIQUIDITY_0, INITIAL_LIQUIDITY_1);

//     expect(await poolInstance.reserve0()).to.equal(INITIAL_LIQUIDITY_0);
//     expect(await poolInstance.reserve1()).to.equal(INITIAL_LIQUIDITY_1);
//   });

  it('should fail to add liquidity if amounts are zero', async () => {
    const { poolInstance, owner } = await loadFixture(deployPoolFixture);

    await expect(poolInstance.connect(owner).addLiquidity(0, INITIAL_LIQUIDITY_1)).to.be.revertedWith('Amounts must be greater than zero');
    await expect(poolInstance.connect(owner).addLiquidity(INITIAL_LIQUIDITY_0, 0)).to.be.revertedWith('Amounts must be greater than zero');
  });

//   it('should remove liquidity successfully', async () => {
//     const { poolInstance, owner } = await loadFixture(deployPoolFixture);

//     // Add liquidity to the pool
//     await poolInstance.connect(owner).addLiquidity(INITIAL_LIQUIDITY_0, INITIAL_LIQUIDITY_1);

//     // Remove liquidity from the pool
//     await poolInstance.connect(owner).removeLiquidity(INITIAL_LIQUIDITY_0);

//     expect(await poolInstance.reserve0()).to.equal(0);
//     expect(await poolInstance.reserve1()).to.equal(0);
//   });

  it('should fail to remove liquidity if amount is zero', async () => {
    const { poolInstance, owner } = await loadFixture(deployPoolFixture);

    await expect(poolInstance.connect(owner).removeLiquidity(0)).to.be.revertedWith('Liquidity must be greater than zero');
  });

  it('should fail to remove liquidity if no liquidity available', async () => {
    const { poolInstance, owner } = await loadFixture(deployPoolFixture);

    await expect(poolInstance.connect(owner).removeLiquidity(INITIAL_LIQUIDITY_0)).to.be.revertedWith('No liquidity available');
  });

//   it('should execute a swap successfully', async () => {
//     const { poolInstance, owner, addr1 } = await loadFixture(deployPoolFixture);

//     // Add liquidity to the pool
//     await poolInstance.connect(owner).addLiquidity(INITIAL_LIQUIDITY_0, INITIAL_LIQUIDITY_1);

//     // Swap token0 for token1
//     const amountIn = 100;
//     await poolInstance.connect(addr1).swap(amountIn, TOKEN_1_ADDRESS, addr1.address);

//     const reserve0 = await poolInstance.reserve0();
//     const reserve1 = await poolInstance.reserve1();

//     expect(reserve0).to.be.above(INITIAL_LIQUIDITY_0);
//     expect(reserve1).to.be.below(INITIAL_LIQUIDITY_1);
//   });

  it('should fail to execute a swap if amountIn is zero', async () => {
    const { poolInstance, addr1 } = await loadFixture(deployPoolFixture);

    await expect(poolInstance.connect(addr1).swap(0, TOKEN_1_ADDRESS, addr1.address)).to.be.revertedWith('AmountIn must be greater than zero');
  });

  it('should fail to execute a swap if recipient address is zero', async () => {
    const { poolInstance, addr1 } = await loadFixture(deployPoolFixture);

    await expect(poolInstance.connect(addr1).swap(100, TOKEN_1_ADDRESS, ethers.ZeroAddress)).to.be.revertedWith('Invalid recipient address');
  });
});
