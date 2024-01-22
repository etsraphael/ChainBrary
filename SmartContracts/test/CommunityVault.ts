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

  function getRandomDepositAmount(max: number): number {
    return Math.floor(Math.random() * max);
  }

  function getRandomRewardAmount(max: number): number {
    return Math.random() * max;
  }

  function calculateReward(amount: number, totalAmount: number, rewardAmount: number): number {
    return (amount / totalAmount) * rewardAmount;
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
      const amountToSendRaw: number = getRandomDepositAmount(1000);
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
      const amounts: number[] = [
        getRandomDepositAmount(1000),
        getRandomDepositAmount(1000),
        getRandomDepositAmount(1000)
      ]; // Deposit amounts
      let totalAmount: bigint = BigInt(0);

      // Sender sends the fund
      for (const [index, addr] of [addr1, addr2, addr3].entries()) {
        const tx = await depositAmountByAddress(communityVault, addr, amounts[index]);
        await tx.wait();
        totalAmount += ethers.parseEther(String(amounts[index]));
      }

      // Checking the Total Stacking Balance
      expect(await communityVault.totalStaked()).to.equal(totalAmount);
    });
  });

  describe('Reward', function () {
    it.only('Should distribute rewards proportionally to the amount staked', async function () {
      const { communityVault, owner, addr1, addr2, addr3, addr4, addr5 } = await loadFixture(deployContractFixture);

      // get contract address
      const contractAddress = await communityVault.getAddress();

      // Amount to stake
      const amounts: number[] = [20, 20, 40, 10, 10];

      const stakeAmount1: bigint = ethers.parseEther(String(amounts[0])); // 20
      const stakeAmount2: bigint = ethers.parseEther(String(amounts[1])); // 20
      const stakeAmount3: bigint = ethers.parseEther(String(amounts[2])); // 40

      // Users stake their tokens
      await depositAmountByAddress(communityVault, addr1, amounts[0]);
      await depositAmountByAddress(communityVault, addr2, amounts[1]);

      // Check deposit balances
      const depositBalance1: bigint = await communityVault.getDepositByUser(addr1.address);
      const depositBalance2: bigint = await communityVault.getDepositByUser(addr2.address);
      expect(depositBalance1).to.equal(stakeAmount1);
      expect(depositBalance2).to.equal(stakeAmount2);

      // Check reward balances
      let rewardBalance1: bigint = await communityVault.pendingReward(addr1.address);
      let rewardBalance2: bigint = await communityVault.pendingReward(addr2.address);
      expect(rewardBalance1).to.equal(0);
      expect(rewardBalance2).to.equal(0);

      // Send rewards to the contract
      const rewardAmount1Raw: number = 1;
      const rewardAmount2Raw: number = 10;
      const rewardAmount3Raw: number = 100;
      let rewardAmount1: bigint = ethers.parseEther(String(rewardAmount1Raw));
      let rewardAmount10: bigint = ethers.parseEther(String(rewardAmount2Raw));
      let rewardAmount100: bigint = ethers.parseEther(String(rewardAmount3Raw));
      await owner.sendTransaction({ to: contractAddress, value: rewardAmount1.toString() });

      // Check reward balances
      const rewardExpected1: bigint = ethers.parseEther(
        String(calculateReward(amounts[0], amounts[0] + amounts[1], rewardAmount1Raw))
      );
      const rewardExpected2: bigint = ethers.parseEther(
        String(calculateReward(amounts[1], amounts[0] + amounts[1], rewardAmount1Raw))
      );
      expect(await communityVault.pendingReward(addr1.address)).to.equal(rewardExpected1);
      expect(await communityVault.pendingReward(addr2.address)).to.equal(rewardExpected2);

      // User 3 stakes their tokens
      await communityVault.connect(addr3).deposit({ value: stakeAmount3.toString() });

      // Check reward balances
      expect(await communityVault.pendingReward(addr3.address)).to.equal(0);

      // Send more rewards to the contract
      await owner.sendTransaction({ to: contractAddress, value: rewardAmount10.toString() });

      // Check reward balances
      rewardBalance1 = await communityVault.pendingReward(addr1.address);
      rewardBalance2 = await communityVault.pendingReward(addr2.address);
      const rewardBalance3: bigint = await communityVault.pendingReward(addr3.address);

      const rewardExpected3: bigint =
        rewardExpected1 +
        ethers.parseEther(String(calculateReward(amounts[0], amounts[0] + amounts[1] + amounts[2], rewardAmount2Raw)));
      const rewardExpected4: bigint =
        rewardExpected1 +
        ethers.parseEther(String(calculateReward(amounts[1], amounts[0] + amounts[1] + amounts[2], rewardAmount2Raw)));
      const rewardExpected5: bigint = ethers.parseEther(
        String(calculateReward(amounts[2], amounts[0] + amounts[1] + amounts[2], rewardAmount2Raw))
      );

      expect(rewardBalance1).to.equal(rewardExpected3);
      expect(rewardBalance2).to.equal(rewardExpected4);
      expect(rewardBalance3).to.equal(rewardExpected5);

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
      await depositAmountByAddress(communityVault, addr4, amounts[3]);
      expect(await communityVault.pendingReward(addr4.address)).to.equal(0);

      // Send more rewards to the contract
      await owner.sendTransaction({ to: contractAddress, value: rewardAmount10 });
      expect(await communityVault.pendingReward(addr4.address)).to.equal(rewardAmount10);

      // new stacker
      await depositAmountByAddress(communityVault, addr5, amounts[4]);
      expect(await communityVault.pendingReward(addr5.address)).to.equal(0);

      // Send more rewards to the contract
      await owner.sendTransaction({ to: contractAddress, value: rewardAmount100 });

      // check balances
      const rewardExpected6: bigint = ethers.parseEther(
        String(
          calculateReward(amounts[3], amounts[3], rewardAmount2Raw) +
            calculateReward(amounts[3], amounts[3] + amounts[4], rewardAmount3Raw)
        )
      );
      const rewardExpected7: bigint = ethers.parseEther(
        String(calculateReward(amounts[4], amounts[3] + amounts[4], rewardAmount3Raw))
      );

      expect(await communityVault.pendingReward(addr4.address)).to.equal(rewardExpected6);
      expect(await communityVault.pendingReward(addr5.address)).to.equal(rewardExpected7);
    });
  });
});
