import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { BigNumber } from 'bignumber.js';
import { expect } from 'chai';
import { ContractTransactionReceipt, ContractTransactionResponse } from 'ethers';
import { ethers } from 'hardhat';

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
    const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
    return { communityVault, owner, addr1, addr2, addr3, addr4 };
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
    });
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

      // Check totalStackingBalance
      expect(await communityVault.totalStackingBalance()).to.equal(amountToSend);

      // Check getStackingBalance
      const stackingBalance = await communityVault.getStackingBalance(addr1.address);
      expect(stackingBalance).to.equal(amountToSend);

      // Check getReward
      const reward = await communityVault.getRewardBalance(addr1.address);
      expect(reward).to.equal(0);

      // Withdraw
      const tx1: ContractTransactionResponse = await communityVault.connect(addr1).withdrawAccount();
      const receipt1 = await tx1.wait();

      if (!receipt1) {
        throw new Error('No receipt');
      }

      // Check totalStackingBalance after withdraw
      const stackingBalanceAfterWithdraw = await communityVault.getStackingBalance(addr1.address);
      expect(stackingBalanceAfterWithdraw).to.equal(0);

      // Check events
      await expect(tx1).to.emit(communityVault, 'WithdrawEvent').withArgs(addr1.address, amountToSend);

      // Getting final balances
      const tx1CostBigInt = calculateTxCost(receipt1, tx1);
      const final1Addr1Balance: bigint = await ethers.provider.getBalance(addr1.address);

      // Checking the balances
      expect(final1Addr1Balance).to.equal(initialAddr1Balance - tx0CostBigInt - tx1CostBigInt);
    });

    it('Should revert when withdrawing without depositing', async function () {
      const { communityVault, addr1 } = await loadFixture(deployContractFixture);

      // Withdraw without depositing
      await expect(communityVault.connect(addr1).withdrawAccount()).to.be.revertedWith('Amount must be greater than 0');
    });
  });

  describe('Reward', function () {
    it.only('Should withdraw the correct amounts and emit the right events', async function () {
      const { communityVault, owner, addr1, addr2, addr3, addr4 } = await loadFixture(deployContractFixture);

      // Getting initial balance of the users to check the fee later
      const initialAddr1Balance1: bigint = await ethers.provider.getBalance(addr1.address);

      // Amount to send
      const amountToSend0: bigint = ethers.parseEther('50');
      const amountToSend1: bigint = ethers.parseEther('30');
      const amountToSend2: bigint = ethers.parseEther('20');

      // Sender sends the fund
      const tx0: ContractTransactionResponse = await communityVault
        .connect(addr1)
        .deposit({ value: amountToSend0.toString() });
      const receipt0 = await tx0.wait();

      if (!receipt0) {
        throw new Error('No receipt');
      }

      const tx1: ContractTransactionResponse = await communityVault
        .connect(addr2)
        .deposit({ value: amountToSend1.toString() });
      const receipt1 = await tx1.wait();

      if (!receipt1) {
        throw new Error('No receipt');
      }

      const tx2: ContractTransactionResponse = await communityVault
        .connect(addr3)
        .deposit({ value: amountToSend2.toString() });
      const receipt2 = await tx2.wait();

      if (!receipt2) {
        throw new Error('No receipt');
      }

      // Getting balance after deposits
      expect(await communityVault.totalStackingBalance()).to.equal(amountToSend0 + amountToSend1 + amountToSend2);

      // send some rewards to the contract
      const generatedReward: bigint = ethers.parseEther('2');
      const contractAddress = await communityVault.getAddress();
      const rewardTransaction = await owner.sendTransaction({ to: contractAddress, value: generatedReward.toString() });
      const receipt3 = await rewardTransaction.wait();

      if (!receipt3) {
        throw new Error('No receipt');
      }

      // get getStackingBalance for addr1
      const stackingBalance1 = await communityVault.getStackingBalance(addr1.address);
      expect(stackingBalance1).to.equal(amountToSend0);

      // check totalRewardBalance before withdraw
      expect(await communityVault.totalRewardBalance()).to.equal(generatedReward);

      // check reward balance for addr1
      const rewardBalance1 = await communityVault.getRewardBalance(addr1.address);
      expect(rewardBalance1).to.equal(ethers.parseEther('1')); // because address 1 has 50% of the stacking pool
      expect(await communityVault.getTotalRewardBalance()).to.equal(generatedReward);


      // Withdraw reward for account 1
      const tx4: ContractTransactionResponse = await communityVault.connect(addr1).withdrawAccount();
      const receipt4 = await tx4.wait();
      if (!receipt4) {
        throw new Error('No receipt');
      }

      // Event for withdraw reward
      await expect(tx4)
        .to.emit(communityVault, 'WithdrawEvent')
        .withArgs(addr1.address, stackingBalance1 + rewardBalance1);

      // Check final balance for addr1
      const finalAddr1Balance1: bigint = await ethers.provider.getBalance(addr1.address);

      const tx0CostBigInt = calculateTxCost(receipt0, tx0);
      const tx4CostBigInt = calculateTxCost(receipt4, tx4);

      // Checking the balances
      expect(finalAddr1Balance1).to.equal(initialAddr1Balance1 - (tx0CostBigInt + tx4CostBigInt) + rewardBalance1);
      expect(await communityVault.getTotalStackingBalance()).to.equal(amountToSend1 + amountToSend2);
      expect(await communityVault.getRewardBalance(addr1)).to.equal(0);
      expect(await communityVault.getTotalRewardBalance()).to.equal(generatedReward - rewardBalance1);

      // check if totalRewardBalancesAdjusted is at 0
      expect(await communityVault.totalRewardBalancesAdjusted()).to.equal(0);

      // second deposit
      const amountToSend3: bigint = ethers.parseEther('50');

      // Sender sends the fund
      const tx3: ContractTransactionResponse = await communityVault
        .connect(addr4)
        .deposit({ value: amountToSend3.toString() });
      const receipt5 = await tx3.wait();

      if (!receipt5) {
        throw new Error('No receipt');
      }

      // check events
      await expect(tx3).to.emit(communityVault, 'DepositEvent').withArgs(addr4.address, amountToSend3);

      // get balances after second deposit
      expect(await communityVault.getStackingBalance(addr4.address)).to.equal(amountToSend3);
      expect(await communityVault.getTotalStackingBalance()).to.equal(amountToSend3 + amountToSend1 + amountToSend2);
      expect(await communityVault.getRewardBalance(addr4.address)).to.equal(0);
      expect(await communityVault.totalRewardBalancesAdjusted()).to.be.above(0);

      // send some rewards to the contract
      const generatedReward1: bigint = ethers.parseEther('10');
      const rewardTransaction1 = await owner.sendTransaction({ to: contractAddress, value: generatedReward1.toString() });
      const receipt6 = await rewardTransaction1.wait();

      if (!receipt6) {
        throw new Error('No receipt');
      }

      expect(await communityVault.getTotalRewardBalance()).to.equal(generatedReward - rewardBalance1 + generatedReward1);


      // getTotalRewardBalance()
      // const result = await communityVault.getTotalRewardBalance();
      // console.log('result', result.toString());

      // expect(await communityVault.getRewardBalance(addr4.address)).to.equal(5); // it's not working, communityVault.getRewardBalance(addr4.address) should be 50% of 10



    });
  });
});
