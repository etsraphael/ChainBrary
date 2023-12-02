import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { BigNumber } from 'bignumber.js';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('TransactionBridge', function () {
  async function deployContractFixture() {
    const TransactionBridge = await ethers.getContractFactory('TransactionBridge');
    const transactionBridge = await TransactionBridge.deploy();
    const [owner, addr1, addr2] = await ethers.getSigners();
    return { transactionBridge, owner, addr1, addr2 };
  }

  const calculateCommunityFee = (bidAmount: bigint) => {
    return new BigNumber(bidAmount.toString()).times(0.001);
  };

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const { transactionBridge, owner } = await loadFixture(deployContractFixture);
      expect(await transactionBridge.owner()).to.equal(owner.address);
    });
  });

  describe('transferFund', function () {
    it('Should transfer the correct amounts and emit the right events', async function () {
      const { transactionBridge, owner, addr1, addr2 } = await loadFixture(deployContractFixture);

      // Getting initial balance of the owner to check the fee later
      const initialOwnerBalance: bigint = await ethers.provider.getBalance(owner.address);
      const initialAddr1Balance: bigint = await ethers.provider.getBalance(addr1.address);
      const initialAddr2Balance: bigint = await ethers.provider.getBalance(addr2.address);

      // Sender sends the fund, instead of the owner
      const amountToSend: bigint = ethers.parseEther('10');
      const tx = await transactionBridge.connect(addr1).transferFund(addr2, { value: amountToSend.toString() });
      const receipt = await tx.wait();

      if (!receipt) {
        throw new Error('No receipt');
      }

      // Tx cost
      const gasUsed: BigNumber = new BigNumber(receipt.gasUsed.toString());
      const gasPrice: BigNumber = new BigNumber(tx.gasPrice.toString());
      const txCost: BigNumber = gasUsed.times(gasPrice);
      const txCostBigInt: bigint = BigInt(txCost.toString());
      
      const communityFee: BigNumber = calculateCommunityFee(amountToSend);
      const communityFeeBigInt: bigint = BigInt(communityFee.toString());

      // Getting final balances
      const finalOwnerBalance: bigint = await ethers.provider.getBalance(owner.address);
      const finalAddr1Balance: bigint = await ethers.provider.getBalance(addr1.address);
      const finalAddr2Balance: bigint = await ethers.provider.getBalance(addr2.address);

      // Expected balances
      const expectedOwnerBalance = initialOwnerBalance + communityFeeBigInt;
      const expectedAddr1Balance = initialAddr1Balance - (amountToSend + txCostBigInt);
      const expectedAddr2Balance = initialAddr2Balance + amountToSend - communityFeeBigInt;

      // Check balances
      expect(expectedOwnerBalance).to.equal(finalOwnerBalance);
      expect(expectedAddr1Balance).to.equal(finalAddr1Balance);
      expect(expectedAddr2Balance).to.equal(finalAddr2Balance);

      // Check emitted events
      await expect(tx)
        .to.emit(transactionBridge, 'Transfer')
        .withArgs(addr1.address, addr2.address, amountToSend - communityFeeBigInt, communityFeeBigInt)
    });
  });

});
