import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { BigNumber } from 'bignumber.js';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ContractTransactionReceipt, ContractTransactionResponse } from 'ethers';

describe('TransactionBridge', function () {
  async function deployContractFixture() {
    const TransactionBridge = await ethers.getContractFactory('TransactionBridge');
    const Token = await ethers.getContractFactory('ERC20FixedSupply');
    const transactionBridge = await TransactionBridge.deploy();
    const token = await Token.deploy();
    const [owner, addr1, addr2] = await ethers.getSigners();
    return { transactionBridge, owner, addr1, addr2, token };
  }

  const calculateCommunityFee = (bidAmount: bigint) => {
    return new BigNumber(bidAmount.toString()).times(0.001);
  };

  const calculateTxCost = (receipt: ContractTransactionReceipt, tx: ContractTransactionResponse) => {
    const gasUsed = new BigNumber(receipt.gasUsed.toString());
    const gasPrice = new BigNumber(tx.gasPrice.toString());
    const txCost = gasUsed.times(gasPrice);
    return BigInt(txCost.toString());
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

      // Tx cost.
      const txCostBigInt = calculateTxCost(receipt, tx);
      
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

  describe('TransferTokenFund', function () {
    it('Should transfer tokens correctly and emit the right events', async function () {
      const { transactionBridge, owner, addr1, addr2, token } = await loadFixture(deployContractFixture);

      // send liquidity to addr1
      const liquidityAmount: bigint = ethers.parseEther('100');
      await token.connect(owner).transfer(addr1.address, liquidityAmount);
  
      // Initial token balances
      const initialOwnerTokenBalance: bigint = await token.balanceOf(owner.address);
      const initialAddr1TokenBalance: bigint = await token.balanceOf(addr1.address);
      const initialAddr2TokenBalance: bigint = await token.balanceOf(addr2.address);
  
      // addr1 approves transactionBridge to spend tokens
      const tokenAmount: bigint = ethers.parseEther('10');
      const tx0 = await token.connect(addr1).approve(await transactionBridge.getAddress(), tokenAmount);
      const receipt0: ContractTransactionReceipt | null  = await tx0.wait();
      if (!receipt0) {
        throw new Error('No receipt');
      }

      // check approve event emitted
      await expect(tx0)
        .to.emit(token, 'Approval')
        .withArgs(addr1.address, await transactionBridge.getAddress(), tokenAmount);

      // addr1 initiates transfer
      const tx1 = await transactionBridge.connect(addr1).transferTokenFund(tokenAmount, addr2.address, await token.getAddress());
      const receipt1 = await tx1.wait();
      if (!receipt1) {
        throw new Error('No receipt');
      }
  
      // Calculate expected fee and final balances
      const fee = calculateCommunityFee(tokenAmount);
      const feeBigInt = BigInt(fee.toString());

      // Tx0 cost
      const txCost0BigInt = calculateTxCost(receipt0, tx0);
      const txCost1BigInt = calculateTxCost(receipt1, tx1);

      // Expected balances
      const expectedOwnerTokenBalance = initialOwnerTokenBalance + feeBigInt;
      const expectedAddr1TokenBalance = initialAddr1TokenBalance - tokenAmount;
      const expectedAddr2TokenBalance = initialAddr2TokenBalance + tokenAmount - feeBigInt;
  
      // Verify final balances
      expect(await token.balanceOf(owner.address)).to.equal(expectedOwnerTokenBalance);
      expect(await token.balanceOf(addr1.address)).to.equal(expectedAddr1TokenBalance);
      expect(await token.balanceOf(addr2.address)).to.equal(expectedAddr2TokenBalance);

    
  
    //   // Verify emitted events
    //   await expect(tx)
    //     .to.emit(transactionBridge, 'TransferToken')
    //     .withArgs(addr1.address, addr2.address, tokenAmount.sub(fee), token.address);
    });
  });



  // TODO: Transfer token without funds
  

});
