import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('CustomERC20Token', function () {
  const deployTokenFixture = async (mintable: boolean, burnable: boolean, pausable: boolean) => {
    const CustomERC20Token = await ethers.getContractFactory('CustomERC20Token');
    const [owner, addr1, addr2] = await ethers.getSigners();

    const token = await CustomERC20Token.deploy(
      owner,
      'CustomToken',
      'CTK',
      '1000', // Initial supply
      mintable,
      burnable,
      pausable
    );

    return { token, owner, addr1, addr2 };
  };

  async function deployMintableFixture() {
    return deployTokenFixture(true, false, false);
  }

  async function deployNonMintableFixture() {
    return deployTokenFixture(false, false, false);
  }

  async function deployBurnableFixture() {
    return deployTokenFixture(false, true, false);
  }

  async function deployNonBurnableFixture() {
    return deployTokenFixture(false, false, false);
  }

  async function deployPausableFixture() {
    return deployTokenFixture(false, false, true);
  }

  describe('Minting', function () {
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
      await expect(token.connect(owner).mint(owner, ethers.parseEther('100'))).to.be.revertedWith(
        'Token is not mintable'
      );
      await expect(token.connect(addr1).mint(owner, ethers.parseEther('100')))
        .to.be.revertedWithCustomError(token, 'OwnableUnauthorizedAccount')
        .withArgs(addr1.address);
    });
  });

  describe('Burning', function () {
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
      await expect(token.connect(addr1).burn(ethers.parseEther('100'))).to.be.revertedWithCustomError(token, 'OwnableUnauthorizedAccount')
      .withArgs(addr1.address);
      await expect(token.connect(owner).burn(ethers.parseEther('100'))).to.be.revertedWith('Token is not burnable');
    });
  });

  // describe('Pausing', function () {
  //   it('Should allow owner to pause', async function () {
  //     const { token, owner } = await loadFixture(deployTokenFixture);
  //     await token.connect(owner).pause();
  //     expect(await token.paused()).to.equal(true);
  //   });

  //   it('Should not allow non-owner to pause', async function () {
  //     const { token, addr1 } = await loadFixture(deployTokenFixture);
  //     await expect(token.connect(addr1).pause()).to.be.revertedWith('Ownable: caller is not the owner');
  //   });

  //   it('Should allow owner to unpause', async function () {
  //     const { token, owner } = await loadFixture(deployTokenFixture);
  //     await token.connect(owner).pause();
  //     await token.connect(owner).unpause();
  //     expect(await token.paused()).to.equal(false);
  //   });

  //   it('Should not allow non-owner to unpause', async function () {
  //     const { token, addr1, owner } = await loadFixture(deployTokenFixture);
  //     await token.connect(owner).pause();
  //     await expect(token.connect(addr1).unpause()).to.be.revertedWith('Ownable: caller is not the owner');
  //   });
  // });
});
