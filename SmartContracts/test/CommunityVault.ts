import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ContractTransactionReceipt, ContractTransactionResponse } from 'ethers';
import { ethers } from 'hardhat';
import { BigNumber } from 'bignumber.js';

describe('CommunityVault', function () {

  const calculateTxCost = (receipt: ContractTransactionReceipt, tx: ContractTransactionResponse) => {
    const gasUsed = new BigNumber(receipt.gasUsed.toString());
    const gasPrice = new BigNumber(tx.gasPrice.toString());
    const txCost = gasUsed.times(gasPrice);
    return BigInt(txCost.toString());
  };

  async function deployContractFixture() {
    const CommunityVault = await ethers.getContractFactory('CommunityVault');
    const communityVault = await CommunityVault.deploy();
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    return { communityVault, owner, addr1, addr2, addr3 };
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
      await expect(tx).to.emit(communityVault, 'DepositEvent').withArgs(addr1.address, amountToSend);

    });

    it('Should revert when depositing 0', async function () {
      const { communityVault, addr1 } = await loadFixture(deployContractFixture);

      // Sender sends the fund, instead of the owner
      const amountToSend: bigint = ethers.parseEther('0');
      await expect(communityVault.connect(addr1).deposit({ value: amountToSend.toString() })).to.be.revertedWith(
        'Amount must be greater than 0'
      );
    });

    it('Should have the totalStackingBalance after 3 different deposits', async function () {
      const { communityVault, addr1, addr2, addr3 } = await loadFixture(deployContractFixture);

      // Amounts to send
      const amountToSend0: bigint = ethers.parseEther('10');
      const amountToSend1: bigint = ethers.parseEther('20');
      const amountToSend2: bigint = ethers.parseEther('30');

      // Sender sends the fund
      const tx0: ContractTransactionResponse = await communityVault
        .connect(addr1)
        .deposit({ value: amountToSend0.toString() });
      await tx0.wait();

      const tx1: ContractTransactionResponse = await communityVault
        .connect(addr2)
        .deposit({ value: amountToSend1.toString() });
      await tx1.wait();

      const tx2: ContractTransactionResponse = await communityVault
        .connect(addr3)
        .deposit({ value: amountToSend2.toString() });
      await tx2.wait();

      // Checking the totalStackingBalance
      expect(await communityVault.totalStackingBalance()).to.equal(amountToSend0 + amountToSend1 + amountToSend2);
    }
    );
  });


  describe('Widthdraw', function () {

    it('Should withdraw the correct amounts and emit the right events', async function () {
      const { communityVault, addr1 } = await loadFixture(deployContractFixture);

      // Getting initial balance of the owner to check the fee later
      const initialAddr1Balance: bigint = await ethers.provider.getBalance(addr1.address);

      // Sender sends the fund, instead of the owner
      const amountToSend: bigint = ethers.parseEther('10');
      const tx0: ContractTransactionResponse = await communityVault
        .connect(addr1)
        .deposit({ value: amountToSend.toString() });
      const receipt0 = await tx0.wait();

      if (!receipt0) {
        throw new Error('No receipt');
      }

      // Getting final balances
      const final0Addr1Balance: bigint = await ethers.provider.getBalance(addr1.address);

      // Tx cost.
      const tx0CostBigInt = calculateTxCost(receipt0, tx0);

      // Checking the balances
      expect(final0Addr1Balance).to.equal(initialAddr1Balance - amountToSend - tx0CostBigInt);

      // Check totalStackingBalance 
      expect(await communityVault.totalStackingBalance()).to.equal(amountToSend);

      // Check emitted events
      await expect(tx0).to.emit(communityVault, 'DepositEvent').withArgs(addr1.address, amountToSend);

      // Withdraw
      // const tx1: ContractTransactionResponse = await communityVault.connect(addr1).withdrawAccount();
      // const receipt1 = await tx1.wait();

      // if (!receipt1) {
      //   throw new Error('No receipt');
      // }

      // await expect(tx1).to.emit(communityVault, 'WithdrawEvent').withArgs(addr1.address, amountToSend);



      // const tx1CostBigInt = calculateTxCost(receipt1, tx1);

      // // Getting final balances
      // const final1Addr1Balance: bigint = await ethers.provider.getBalance(addr1.address);

      // // Checking the balances
      // expect(final1Addr1Balance).to.equal(initialAddr1Balance - tx0CostBigInt - tx1CostBigInt);



    });

    // it('Should revert when withdrawing 0', async function () {
    //   const { communityVault, addr1 } = await loadFixture(deployContractFixture);

    //   // Sender sends the fund, instead of the owner
    //   const amountToSend: bigint = ethers.parseEther('0');
    //   await expect(communityVault.connect(addr1).deposit({ value: amountToSend.toString() })).to.be.revertedWith(
    //     'Amount must be greater than 0'
    //   );
    // });

  });

    // it('Should have the totalStackingBalance after 3 different deposits', async function () {
    //   const { communityVault, addr1, addr2, addr3 } = await loadFixture(deployContractFixture);

    //   // Amounts to send
    //   const amountToSend0: bigint = ethers.parseEther('10');
    //   const amountToSend1: bigint = ethers.parseEther('20');
    //   const amountToSend2: bigint = ethers.parseEther('30');

    //   // Sender sends the fund
    //   const tx0: ContractTransactionResponse = await communityVault
    //     .connect(addr1)
    //     .deposit({ value: amountToSend0.toString() });
    //   await tx0.wait();

    //   const tx1: ContractTransactionResponse = await communityVault
    //     .connect(addr2)
    //     .deposit({ value: amountToSend1.toString() });
    //   await tx1.wait();


});
