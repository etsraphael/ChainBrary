import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ContractTransactionResponse } from 'ethers';
import { ethers } from 'hardhat';
import {
    ChainbrarySwapFactory,
    ChainbrarySwapFactory__factory
} from '../typechain-types';


const TOKEN_1_ADDRESS = '0x0000000000000000000000000000000000000001';
const TOKEN_2_ADDRESS = '0x0000000000000000000000000000000000000002';
const FEE_TIER_1 = 500;
const FEE_TIER_2 = 3000;
const FEE_TIER_3 = 10000;

describe('ChainbrarySwapFactory', function () {
  const deployChainbrarySwapFactoryFixture = async () => {
    const chainbrarySwapFactory: ChainbrarySwapFactory__factory = await ethers.getContractFactory('ChainbrarySwapFactory');
    const [owner, addr1, addr2] = await ethers.getSigners();
    const chainbrarySwapFactoryInstance: ChainbrarySwapFactory = await chainbrarySwapFactory.deploy();
    await chainbrarySwapFactoryInstance.initialize();
    return { chainbrarySwapFactoryInstance, owner, addr1, addr2 };
  };

  it('should initialize ChainbrarySwapFactory with fee tiers', async () => {
    const { chainbrarySwapFactoryInstance } = await loadFixture(deployChainbrarySwapFactoryFixture);

    // Verify fee tiers
    expect(await chainbrarySwapFactoryInstance.feeTiers(0)).to.equal(FEE_TIER_1);
    expect(await chainbrarySwapFactoryInstance.feeTiers(1)).to.equal(FEE_TIER_2);
    expect(await chainbrarySwapFactoryInstance.feeTiers(2)).to.equal(FEE_TIER_3);
  });

  it('should create a pool for two tokens with a specified fee tier', async () => {
    const { chainbrarySwapFactoryInstance, owner } = await loadFixture(deployChainbrarySwapFactoryFixture);

    // Create pool for TOKEN_1_ADDRESS and TOKEN_2_ADDRESS with FEE_TIER_1
    const createPoolTx: ContractTransactionResponse = await chainbrarySwapFactoryInstance.connect(owner).createPool(TOKEN_1_ADDRESS, TOKEN_2_ADDRESS, FEE_TIER_1);
    await createPoolTx.wait();

    const poolAddress: string = await chainbrarySwapFactoryInstance.getPool(TOKEN_1_ADDRESS, TOKEN_2_ADDRESS, FEE_TIER_1);
    expect(poolAddress).to.properAddress;

    // Verify that the pool has been created and stored in the mapping for both token pairs
    expect(await chainbrarySwapFactoryInstance.getPool(TOKEN_1_ADDRESS, TOKEN_2_ADDRESS, FEE_TIER_1)).to.equal(poolAddress);
    expect(await chainbrarySwapFactoryInstance.getPool(TOKEN_2_ADDRESS, TOKEN_1_ADDRESS, FEE_TIER_1)).to.equal(poolAddress);
  });

  it('should fail to create a pool with identical tokens', async () => {
    const { chainbrarySwapFactoryInstance, owner } = await loadFixture(deployChainbrarySwapFactoryFixture);

    await expect(chainbrarySwapFactoryInstance.connect(owner).createPool(TOKEN_1_ADDRESS, TOKEN_1_ADDRESS, FEE_TIER_1))
      .to.be.revertedWith('Identical tokens');
  });

  it('should fail to create a pool if a pool already exists for the given token pair and fee', async () => {
    const { chainbrarySwapFactoryInstance, owner } = await loadFixture(deployChainbrarySwapFactoryFixture);

    // Create pool for TOKEN_1_ADDRESS and TOKEN_2_ADDRESS with FEE_TIER_1
    const createPoolTx: ContractTransactionResponse = await chainbrarySwapFactoryInstance.connect(owner).createPool(TOKEN_1_ADDRESS, TOKEN_2_ADDRESS, FEE_TIER_1);
    await createPoolTx.wait();

    // Attempt to create the same pool again
    await expect(chainbrarySwapFactoryInstance.connect(owner).createPool(TOKEN_1_ADDRESS, TOKEN_2_ADDRESS, FEE_TIER_1))
      .to.be.revertedWith('Pool exists');
  });

  it('should fail to create a pool if one of the token addresses is zero', async () => {
    const { chainbrarySwapFactoryInstance, owner } = await loadFixture(deployChainbrarySwapFactoryFixture);

    await expect(chainbrarySwapFactoryInstance.connect(owner).createPool(ethers.ZeroAddress, TOKEN_2_ADDRESS, FEE_TIER_1))
      .to.be.revertedWith('Zero address');
  });
});
