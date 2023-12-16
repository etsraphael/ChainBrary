import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { BigNumber } from 'bignumber.js';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ContractTransactionReceipt, ContractTransactionResponse } from 'ethers';

describe('DocumentLocker', function () {
  async function deployContractFixture() {
    const DocumentLocker = await ethers.getContractFactory('DocumentLocker');
    const documentLocker = await DocumentLocker.deploy(
      '0xd174c9C31ddA6FFC5E1335664374c1EbBE2144af',
      'Private document',
      'https://images.unsplash.com/photo-1699099259299-ef7ec1174f64?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      5,
      'This is a private document, please do not share it with anyone else.'
    );
    const [owner, addr1] = await ethers.getSigners();
    return { documentLocker, owner, addr1 };
  }

  const calculateCommunityFee = (bidAmount: bigint) => {
    return new BigNumber(bidAmount.toString()).times(0.001);
  };

  const calculateTxCost = (receipt: ContractTransactionReceipt, tx: ContractTransactionResponse) => {
    const gasUsed = new BigNumber(receipt.gasUsed.toString());
    const gasPrice = new BigNumber(tx.gasPrice.toString());
    const txCost = gasUsed.times(gasPrice);
    return BigInt(txCost.toString());
  };

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const { documentLocker, owner } = await loadFixture(deployContractFixture);
      expect(await documentLocker.owner()).to.equal(owner.address);
    });
  });
});
