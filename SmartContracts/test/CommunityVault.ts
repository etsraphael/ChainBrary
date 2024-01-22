import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { BigNumber } from 'bignumber.js';
import { expect } from 'chai';
import { ContractTransactionReceipt, ContractTransactionResponse } from 'ethers';
import { ethers } from 'hardhat';
import { CommunityVault } from '../typechain-types';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

describe('CommunityVault', function () {
  async function deployContractFixture() {
    const CommunityVault = await ethers.getContractFactory('CommunityVault');
    const communityVault = await CommunityVault.deploy();
    const [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    return { communityVault, owner, addr1, addr2, addr3, addr4, addr5 };
  }

  async function depositAmountByAddress(
    communityVault: CommunityVault,
    addr: HardhatEthersSigner,
    stakeAmount: number
  ): Promise<ContractTransactionResponse> {
    return await communityVault.connect(addr).deposit({ value: ethers.parseEther(String(stakeAmount)) });
  }

  function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
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
      const amountToSendRaw: number = getRandomInt(1000);
      const amountToSend: bigint = ethers.parseEther(String(amountToSendRaw));
      const tx: ContractTransactionResponse = await depositAmountByAddress(communityVault, addr1, amountToSendRaw);

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

      // Check Total Stacking Balance
      expect(await communityVault.totalStaked()).to.equal(amountToSend);

      // Check emitted events
      await expect(tx).to.emit(communityVault, 'DepositEvent').withArgs(addr1.address, amountToSend);
    });

    it('Should revert when depositing 0', async function () {
      const { communityVault, addr1 } = await loadFixture(deployContractFixture);

      // Sender sends the fund, instead of the owner
      await expect(depositAmountByAddress(communityVault, addr1, 0)).to.be.revertedWith(
        'Amount_must_be_greater_than_0'
      );
    });

    it('Should have the Total Stacking Balance after 3 different deposits', async function () {
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

      // Checking the Total Stacking Balance
      expect(await communityVault.totalStaked()).to.equal(amountToSend0 + amountToSend1 + amountToSend2);
    });
  });

  describe('Reward', function () {
    it('Should distribute rewards proportionally to the amount staked', async function () {
      const { communityVault, owner, addr1, addr2, addr3, addr4, addr5 } = await loadFixture(deployContractFixture);

      // get contract address
      const contractAddress = await communityVault.getAddress();

      // Amount to stake
      const stakeAmount1: bigint = ethers.parseEther('20');
      const stakeAmount2: bigint = ethers.parseEther('20');
      const stakeAmount3: bigint = ethers.parseEther('40');
      const stakeAmount4: bigint = ethers.parseEther('10');
      const stakeAmount5: bigint = ethers.parseEther('10');

      // Users stake their tokens
      await communityVault.connect(addr1).deposit({ value: stakeAmount1.toString() });
      await communityVault.connect(addr2).deposit({ value: stakeAmount2.toString() });
      // TODO: use a common code for deposit

      // Check deposit balances
      const depositBalance1 = await communityVault.getDepositByUser(addr1.address);
      const depositBalance2 = await communityVault.getDepositByUser(addr2.address);
      expect(depositBalance1).to.equal(ethers.parseEther('20'));
      expect(depositBalance2).to.equal(ethers.parseEther('20'));

      // Check reward balances
      let rewardBalance1 = await communityVault.pendingReward(addr1.address);
      let rewardBalance2 = await communityVault.pendingReward(addr2.address);
      expect(rewardBalance1).to.equal(0);
      expect(rewardBalance2).to.equal(0);

      // Send rewards to the contract
      const rewardAmount1: bigint = ethers.parseEther('1');
      const rewardAmount10: bigint = ethers.parseEther('10');
      await owner.sendTransaction({ to: contractAddress, value: rewardAmount1.toString() });

      // Check reward balances
      expect(await communityVault.pendingReward(addr1.address)).to.equal(ethers.parseEther('0.5'));
      expect(await communityVault.pendingReward(addr2.address)).to.equal(ethers.parseEther('0.5'));

      // User 3 stakes their tokens
      await communityVault.connect(addr3).deposit({ value: stakeAmount3.toString() });

      // Check reward balances
      expect(await communityVault.pendingReward(addr3.address)).to.equal(0); // not working

      // Send more rewards to the contract
      await owner.sendTransaction({ to: contractAddress, value: rewardAmount10.toString() });

      // Check reward balances
      rewardBalance1 = await communityVault.pendingReward(addr1.address);
      rewardBalance2 = await communityVault.pendingReward(addr2.address);
      const rewardBalance3 = await communityVault.pendingReward(addr3.address);
      expect(rewardBalance1).to.equal(ethers.parseEther('3'));
      expect(rewardBalance2).to.equal(ethers.parseEther('3'));
      expect(rewardBalance3).to.equal(ethers.parseEther('5'));

      // withdraw
      await communityVault.connect(addr1).withdraw();
      await communityVault.connect(addr2).withdraw();
      await communityVault.connect(addr3).withdraw();

      // check balances
      expect(await communityVault.pendingReward(addr1.address)).to.equal(0);
      expect(await communityVault.pendingReward(addr2.address)).to.equal(0);
      expect(await communityVault.pendingReward(addr3.address)).to.equal(0);

      // check balance of the contract
      const contractBalanceByNetwork = await ethers.provider.getBalance(contractAddress);
      const contractBalanceByContract = await communityVault.getBalance();
      expect(contractBalanceByNetwork).to.equal(0);
      expect(contractBalanceByContract).to.equal(0);

      // new stacker
      await communityVault.connect(addr4).deposit({ value: stakeAmount4.toString() });
      expect(await communityVault.pendingReward(addr4.address)).to.equal(0);

      // Send more rewards to the contract
      await owner.sendTransaction({ to: contractAddress, value: ethers.parseEther('10') });
      expect(await communityVault.pendingReward(addr4.address)).to.equal(ethers.parseEther('10'));

      // new stacker
      await communityVault.connect(addr5).deposit({ value: stakeAmount5.toString() });
      expect(await communityVault.pendingReward(addr5.address)).to.equal(0);

      // Send more rewards to the contract
      await owner.sendTransaction({ to: contractAddress, value: ethers.parseEther('10') });
      expect(await communityVault.pendingReward(addr5.address)).to.equal(ethers.parseEther('5'));
      expect(await communityVault.pendingReward(addr4.address)).to.equal(ethers.parseEther('15'));
    });
  });
});
