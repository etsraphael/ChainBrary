import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { BigNumber } from 'bignumber.js';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('DocumentLocker', function () {
  async function deployContractFixture() {
    const DocumentLocker = await ethers.getContractFactory('DocumentLocker');
    const documentLocker = await DocumentLocker.deploy(
      '0xd174c9C31ddA6FFC5E1335664374c1EbBE2144af',
      'Private document',
      'Web3 Dev Provider',
      5,
      'This is a private document, please do not share it with anyone else.'
    );
    const [owner, addr1] = await ethers.getSigners();
    return { documentLocker, owner, addr1 };
  }

  const calculateCommunityFee = (bidAmount: bigint) => {
    return new BigNumber(bidAmount.toString()).times(0.001);
  };

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const { documentLocker, owner } = await loadFixture(deployContractFixture);
      expect(await documentLocker.owner()).to.equal(owner.address);
    });

    it('Should retrieve the document as Owner', async function () {
      const { documentLocker } = await loadFixture(deployContractFixture);
      const [documentName, ownerName, unlockingPrice, documentDesc] = await documentLocker.getFullDocumentData();

      expect(documentName).to.equal('Private document');
      expect(ownerName).to.equal('Web3 Dev Provider');
      expect(unlockingPrice).to.equal(5);
      expect(documentDesc).to.equal('This is a private document, please do not share it with anyone else.');
    });

    it('Should retrieve the document as buyer', async function () {
      const { documentLocker, addr1 } = await loadFixture(deployContractFixture);

      // retreive the document without payment
      await expect(documentLocker.connect(addr1).getFullDocumentData()).to.be.revertedWith('no_access');

      // make a wrong payment
      await expect(documentLocker.connect(addr1).unlockFile({ value: 1 })).to.be.revertedWith('not_enough_funds');

      // retreive the document with payment
      await documentLocker.connect(addr1).unlockFile({ value: 5 });
      const [documentName, ownerName, unlockingPrice, documentDesc] = await documentLocker
        .connect(addr1)
        .getFullDocumentData();

      expect(documentName).to.equal('Private document');
      expect(ownerName).to.equal('Web3 Dev Provider');
      expect(unlockingPrice).to.equal(5);
      expect(documentDesc).to.equal('This is a private document, please do not share it with anyone else.');
    });

    it('Should send the right amount to the owner and the community', async function () {
      const { documentLocker, addr1, owner } = await loadFixture(deployContractFixture);
      const amount: bigint = ethers.parseEther('5');

      // get balance before
      const communityTreasuryInitialBalance: bigint = await ethers.provider.getBalance(
        '0xd174c9C31ddA6FFC5E1335664374c1EbBE2144af'
      );
      const ownerInitialBalance: bigint = await ethers.provider.getBalance(owner.address);

      // retreive the document with payment
      const tx = await documentLocker.connect(addr1).unlockFile({ value: amount });
      const receipt = await tx.wait();

      if (!receipt) {
        throw new Error('No receipt');
      }

      // calculate the tx cost
      const communityFee: BigNumber = calculateCommunityFee(amount);
      const communityFeeBigInt: bigint = BigInt(communityFee.toString());

      const communityTreasuryFinalBalance: bigint = await ethers.provider.getBalance(
        '0xd174c9C31ddA6FFC5E1335664374c1EbBE2144af'
      );
      const ownerFinalBalance: bigint = await ethers.provider.getBalance(owner.address);
      
      expect(communityTreasuryFinalBalance).to.equal(communityTreasuryInitialBalance + communityFeeBigInt);
      expect(ownerFinalBalance).to.equal(ownerInitialBalance + amount - communityFeeBigInt);
    });
  });
});
