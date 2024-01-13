import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ContractTransactionReceipt, ContractTransactionResponse } from 'ethers';
import { ethers } from 'hardhat';

describe('CommunityVault', function () {
  async function deployContractFixture() {
    const CommunityVault = await ethers.getContractFactory('CommunityVault');
    const communityVault = await CommunityVault.deploy();
    const [owner, addr1, addr2] = await ethers.getSigners();
    return { communityVault, owner, addr1, addr2 };
  }

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const { communityVault, owner } = await loadFixture(deployContractFixture);
      expect(await communityVault.owner()).to.equal(owner.address);
    });
  });

  describe('Deposit', function () {
    it('Should deposit the correct amounts and emit the right events', async function () {
      const { communityVault, addr1 } = await loadFixture(deployContractFixture);

      // Getting initial balance of the owner to check the fee later
      const initialAddr1Balance: bigint = await ethers.provider.getBalance(addr1.address);

      // Sender sends the fund, instead of the owner
      const amountToSend: bigint = ethers.parseEther('10');
      const tx: ContractTransactionResponse = await communityVault
        .connect(addr1)
        .deposit({ value: amountToSend.toString() });
      const receipt: ContractTransactionReceipt | null = await tx.wait();

      if (!receipt) {
        throw new Error('No receipt');
      }

      // Getting final balances
      const finalAddr1Balance: bigint = await ethers.provider.getBalance(addr1.address);

      // Tx cost.
      const txCostBigInt = BigInt(receipt.gasUsed.toString()) * BigInt(tx.gasPrice.toString());

      // Checking the balances
      expect(finalAddr1Balance).to.equal(initialAddr1Balance - amountToSend - txCostBigInt);

      // Check totalStackingBalance 
      expect(await communityVault.totalStackingBalance()).to.equal(amountToSend);

      // Check emitted events
      await expect(tx).to.emit(communityVault, 'Deposit').withArgs(addr1.address, amountToSend);

    });

    it('Should revert when depositing 0', async function () {
      const { communityVault, addr1 } = await loadFixture(deployContractFixture);

      // Sender sends the fund, instead of the owner
      const amountToSend: bigint = ethers.parseEther('0');
      await expect(communityVault.connect(addr1).deposit({ value: amountToSend.toString() })).to.be.revertedWith(
        'Amount must be greater than 0'
      );
    });
  });
});
