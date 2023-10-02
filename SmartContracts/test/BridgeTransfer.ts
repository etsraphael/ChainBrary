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

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const { transactionBridge, owner } = await loadFixture(deployContractFixture);
      expect(await transactionBridge.owner()).to.equal(owner.address);
    });
  });

  describe('transferFund', function () {
    it('Should transfer the correct amounts and emit the right events', async function () {
      const { transactionBridge, owner, addr1, addr2 } = await loadFixture(deployContractFixture);

      const recipients = [addr1.address, addr2.address];
      const initialOwnerBalance = new BigNumber((await ethers.provider.getBalance(owner.address)).toString());
      const initialAddr1Balance = new BigNumber((await ethers.provider.getBalance(addr1.address)).toString());
      const initialAddr2Balance = new BigNumber((await ethers.provider.getBalance(addr2.address)).toString());

      const amountToSend = new BigNumber(ethers.parseEther('2').toString());
      const tx = await transactionBridge.connect(owner).transferFund(recipients, { value: amountToSend.toString() });
      const feeRate = new BigNumber((await transactionBridge.feeRate()).toString());
      const fee = amountToSend.times(feeRate).dividedBy(100000);
      const amountPerRecipient = amountToSend.minus(fee).dividedBy(recipients.length);
      const finalAddr1Balance = new BigNumber((await ethers.provider.getBalance(addr1.address)).toString());
      const finalAddr2Balance = new BigNumber((await ethers.provider.getBalance(addr2.address)).toString());

      expect(finalAddr1Balance.toString()).to.equal(initialAddr1Balance.plus(amountPerRecipient).toString());
      expect(finalAddr2Balance.toString()).to.equal(initialAddr2Balance.plus(amountPerRecipient).toString());

      // Check emitted events
      await expect(tx)
        .to.emit(transactionBridge, 'Transfer')
        .withArgs(owner.address, addr1.address, amountPerRecipient.toString(), fee.toString())
        .and.to.emit(transactionBridge, 'Transfer')
        .withArgs(owner.address, addr2.address, amountPerRecipient.toString(), fee.toString());

      const finalOwnerBalance = new BigNumber((await ethers.provider.getBalance(owner.address)).toString());
      expect(finalOwnerBalance.isLessThan(initialOwnerBalance)).to.be.true;
    });

    it("Should revert with 'TransactionBridge: Invalid number of recipients' when 0 recipients", async function () {
      const { transactionBridge, owner } = await loadFixture(deployContractFixture);

      await expect(
        transactionBridge.connect(owner).transferFund([], { value: ethers.parseEther('2') })
      ).to.be.revertedWith('TransactionBridge: Invalid number of recipients');
    });

    // Add more cases to test different scenarios and edge cases
  });

  it('Should transfer the correct fee to the owner', async function () {
    const { transactionBridge, owner, addr1, addr2 } = await loadFixture(deployContractFixture);
    const sender = addr1;
    const recipients = [addr2.address];

    // Getting initial balance of the owner to check the fee later
    const initialOwnerBalance = new BigNumber((await ethers.provider.getBalance(owner.address)).toString());

    const amountToSend = new BigNumber(ethers.parseEther('2').toString());
    const feeRate = new BigNumber((await transactionBridge.feeRate()).toString());
    const fee = amountToSend.times(feeRate).div(100000);

    // Sender sends the fund, instead of the owner
    await transactionBridge.connect(sender).transferFund(recipients, { value: amountToSend.toString() });

    const finalOwnerBalance = new BigNumber((await ethers.provider.getBalance(owner.address)).toString());

    const expectedOwnerBalance = initialOwnerBalance.plus(fee);

    expect(finalOwnerBalance.toString()).to.equal(expectedOwnerBalance.toString());
  });
});
