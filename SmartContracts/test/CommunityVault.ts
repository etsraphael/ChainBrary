import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('CommunityVault', function () {
  async function deployContractFixture() {
    const CommunityVault = await ethers.getContractFactory('CommunityVault');
    const communityVault = await CommunityVault.deploy();
    const [owner, addr1, addr2] = await ethers.getSigners();
    return { communityVault, owner, addr1, addr2 };
  }

  describe('Deployment', function () {
    it.only('Should set the right owner', async function () {
      const { communityVault, owner } = await loadFixture(deployContractFixture);
      expect(await communityVault.owner()).to.equal(owner.address);
    });
  });

});
