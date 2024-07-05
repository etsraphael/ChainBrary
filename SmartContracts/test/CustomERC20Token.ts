import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('CustomERC20Token', function () {
  const deployTokenFixture = async (mintable: boolean, burnable: boolean, pausable: boolean) => {
    const CustomERC20Token = await ethers.getContractFactory('CustomERC20Token');
    const [owner, addr1, addr2] = await ethers.getSigners();
    const token = await CustomERC20Token.deploy(owner, 'CustomToken', 'CTK', 1000, mintable, burnable, pausable, [], []);
    return { token, owner, addr1, addr2 };
  };

  const deployTokenFixtureWithAssignee = async (mintable: boolean, burnable: boolean, pausable: boolean) => {
    const CustomERC20Token = await ethers.getContractFactory('CustomERC20Token');
    const [owner, addr1, addr2] = await ethers.getSigners();
    const token = await CustomERC20Token.deploy(owner, 'CustomToken', 'CTK', 1000, mintable, burnable, pausable, [addr1.address, addr2.address], [20, 20]);
    return { token, owner, addr1, addr2 };
  }

  describe('Minting', function () {
    async function deployMintableFixture() {
      return deployTokenFixture(true, false, false);
    }

    async function deployNonMintableFixture() {
      return deployTokenFixture(false, false, false);
    }

    it('Should allow owner to mint when mintable', async function () {
      const { token, owner, addr1 } = await loadFixture(deployMintableFixture);
      await token.connect(owner).mint(addr1.address, ethers.parseEther('100'));
      expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther('100'));
      expect(await token.totalSupply()).to.equal(ethers.parseEther('1100'));
      await expect(token.connect(addr1).mint(addr1.address, ethers.parseEther('100')))
        .to.be.revertedWithCustomError(token, 'OwnableUnauthorizedAccount')
        .withArgs(addr1.address);
    });

    it('Should not allow non-owner to mint', async function () {
      const { token, owner, addr1 } = await loadFixture(deployNonMintableFixture);
      await expect(token.connect(owner).mint(owner, ethers.parseEther('100'))).to.be.revertedWith('TokenNotMintable');
      await expect(token.connect(addr1).mint(owner, ethers.parseEther('100')))
        .to.be.revertedWithCustomError(token, 'OwnableUnauthorizedAccount')
        .withArgs(addr1.address);
    });
  });

  describe('Burning', function () {
    async function deployBurnableFixture() {
      return deployTokenFixture(false, true, false);
    }

    async function deployNonBurnableFixture() {
      return deployTokenFixture(false, false, false);
    }

    it('Should allow owner to burn when burnable', async function () {
      const { token, owner, addr1 } = await loadFixture(deployBurnableFixture);
      await token.connect(owner).burn(ethers.parseEther('100'));
      expect(await token.totalSupply()).to.equal(ethers.parseEther('900'));
      await expect(token.connect(addr1).burn(ethers.parseEther('100')))
        .to.be.revertedWithCustomError(token, 'OwnableUnauthorizedAccount')
        .withArgs(addr1.address);
    });

    it('Should not allow non-owner to burn', async function () {
      const { token, owner, addr1 } = await loadFixture(deployNonBurnableFixture);
      await expect(token.connect(addr1).burn(ethers.parseEther('100')))
        .to.be.revertedWithCustomError(token, 'OwnableUnauthorizedAccount')
        .withArgs(addr1.address);
      await expect(token.connect(owner).burn(ethers.parseEther('100'))).to.be.revertedWith('TokenNotBurnable');
    });
  });

  describe('Pausing', function () {
    async function deployPausableFixture() {
      return deployTokenFixture(true, false, true);
    }

    async function deployNonPausableFixture() {
      return deployTokenFixture(false, false, false);
    }

    it('Should allow owner to pause', async function () {
      const { token, owner } = await loadFixture(deployPausableFixture);
      await token.connect(owner).pause();
      expect(await token.paused()).to.equal(true);
    });

    it('Should not allow non-owner to pause', async function () {
      const { token, addr1 } = await loadFixture(deployPausableFixture);
      await expect(token.connect(addr1).pause())
        .to.be.revertedWithCustomError(token, 'OwnableUnauthorizedAccount')
        .withArgs(addr1.address);
    });

    it('Should allow owner to unpause', async function () {
      const { token, owner } = await loadFixture(deployPausableFixture);
      await token.connect(owner).pause();
      await token.connect(owner).unpause();
      expect(await token.paused()).to.equal(false);
    });

    it('Should not allow non-owner to unpause', async function () {
      const { token, addr1, owner } = await loadFixture(deployPausableFixture);
      await token.connect(owner).pause();
      await expect(token.connect(addr1).unpause())
        .to.be.revertedWithCustomError(token, 'OwnableUnauthorizedAccount')
        .withArgs(addr1.address);
    });

    // make a transaction when the contract is paused
    it('Should not allow to make a transaction when the contract is paused', async function () {
      const { token, owner, addr1, addr2 } = await loadFixture(deployPausableFixture);

      // transfer funds to addr1 first
      await token.connect(owner).transfer(addr1.address, ethers.parseEther('100'));

      await token.connect(owner).pause();
      expect(await token.paused()).to.equal(true);

      await expect(token.connect(addr1).transfer(addr2.address, ethers.parseEther('10')))
        .to.be.revertedWithCustomError(token, 'EnforcedPause')
        .withArgs();
    });
  });


  // Assignee related tests
  describe('Assignee related tests', function () {
    async function deployMintableFixtureWithAssignee() {
      return deployTokenFixtureWithAssignee(true, false, false);
    }

    async function deployNonMintableFixtureWithAssignee() {
      return deployTokenFixtureWithAssignee(false, false, false);
    }

    it('Should return the right balance', async function () {
      const { token, owner, addr1, addr2 } = await loadFixture(deployMintableFixtureWithAssignee);
      expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther('20'));
      expect(await token.balanceOf(addr2.address)).to.equal(ethers.parseEther('20'));
      await token.connect(addr1).transfer(addr2.address, ethers.parseEther('10'));
      expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther('10'));
      expect(await token.balanceOf(addr2.address)).to.equal(ethers.parseEther('30'));
    });

  });

});
