import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { BigNumber } from 'bignumber.js';
import { expect } from 'chai';
import { ContractTransactionReceipt, ContractTransactionResponse } from 'ethers';
import { ethers } from 'hardhat';

describe('CommunityVault', function () {
  async function deployContractFixture() {
    const CommunityVault = await ethers.getContractFactory('CommunityVault');
    const communityVault = await CommunityVault.deploy();
    const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
    return { communityVault, owner, addr1, addr2, addr3, addr4 };
  }

  // describe('Deployment', function () {
  //   it('Should set the right owner', async function () {
  //     const { communityVault, owner } = await loadFixture(deployContractFixture);
  //     expect(await communityVault.owner()).to.equal(owner.address);
  //   });
  // });

  describe('Reward', function () {
    it.only('Should distribute rewards proportionally to the amount staked', async function () {
      const { communityVault, owner, addr1, addr2, addr3, addr4 } = await loadFixture(deployContractFixture);

      // get contract address
      const contractAddress = await communityVault.getAddress();
  
      // Amount to stake
      const stakeAmount1: bigint = ethers.parseEther('20');
      const stakeAmount2: bigint = ethers.parseEther('20');
      const stakeAmount3: bigint = ethers.parseEther('40');
      const stakeAmount4: bigint = ethers.parseEther('10');
  
      // Users stake their tokens
      await communityVault.connect(addr1).deposit({ value: stakeAmount1.toString()});
      await communityVault.connect(addr2).deposit({ value: stakeAmount2.toString()});
  
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
      await communityVault.connect(addr3).deposit({ value:stakeAmount3.toString()});

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
      await communityVault.connect(addr4).deposit({ value: stakeAmount4.toString()});
      expect(await communityVault.pendingReward(addr4.address)).to.equal(0);

      // Send more rewards to the contract
      await owner.sendTransaction({ to: contractAddress, value: ethers.parseEther('10') });
      expect(await communityVault.pendingReward(addr4.address)).to.equal(ethers.parseEther('10'));

    });



  });


});
