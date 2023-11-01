import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { BigNumber } from 'bignumber.js';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Bid', function () {
  const deployContractFixture = async () => {
    const Bid = await ethers.getContractFactory('Bid');
    const bid = await Bid.deploy('0xd174c9C31ddA6FFC5E1335664374c1EbBE2144af', '5', '120');
    const [owner, addr1, addr2] = await ethers.getSigners();
    return { bid, owner, addr1, addr2 };
  };

  const calculateCommunityFee = (bidAmount: bigint) => {
    return new BigNumber(bidAmount.toString()).times(0.001);
  };

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const { bid, owner } = await loadFixture(deployContractFixture);
      expect(await bid.owner()).to.equal(owner.address);
    });

    it('should start the auction with the current time', async function () {
      const { bid } = await loadFixture(deployContractFixture);
      const block = await ethers.provider.getBlock('latest');
      const blockTimestamp = block?.timestamp;
      const auctionStartTime = await bid.auctionStartTime();
      // We give a leeway of 10 seconds because sometimes there can be a small delay.
      expect(auctionStartTime).to.be.closeTo(blockTimestamp, 10);
    });

    it('should end the auction 2 hours after the start time', async function () {
      const { bid } = await loadFixture(deployContractFixture);
      const auctionStartTime = await bid.auctionStartTime();
      const auctionEndTime = await bid.auctionEndTime();
      expect(auctionEndTime - auctionStartTime).to.equal(2 * 60 * 60); // 2 hours in seconds.
    });

    it('should send 0.1% of fee to the community', async function () {
      const { bid, addr1 } = await loadFixture(deployContractFixture);

      // Get balance of the community treasury before placing any bids
      const communityTreasuryInitialBalance: bigint = await ethers.provider.getBalance('0xd174c9C31ddA6FFC5E1335664374c1EbBE2144af');

      // Addr1 places a bid
      const bidAmount1: bigint = ethers.parseEther('10');
      const tx1 = await bid.connect(addr1).bid({ value: bidAmount1 });
      const receipt = await tx1.wait();

      if (!receipt) {
        throw new Error('No receipt');
      }

      // Calculate the community fee for addr1's bid
      const communityFee: BigNumber = calculateCommunityFee(bidAmount1);
      const communityFeeBigInt: bigint = BigInt(communityFee.toString());

      // Check that the community treasury balance increased by the community fee
      const communityTreasuryBalanceAfterBid: bigint = await ethers.provider.getBalance('0xd174c9C31ddA6FFC5E1335664374c1EbBE2144af');
      const expectedBalanceAfterBid: bigint = communityTreasuryInitialBalance + communityFeeBigInt;

      expect(communityTreasuryBalanceAfterBid).to.equal(expectedBalanceAfterBid);
    });

    it('should extend the auction end time by 15 minutes when a bid is placed in the last 5 minutes', async function () {
      const { bid, addr2 } = await loadFixture(deployContractFixture);
  
      // Move time forward to 1h 55m after auction started.
      await ethers.provider.send("evm_increaseTime", [6900]);
      await ethers.provider.send("evm_mine");
  
      // Get the block timestamp before making the bid.
      const blockBeforeBid = await ethers.provider.getBlock('latest');

      if(!blockBeforeBid) {
        throw new Error('No block');
      }

      const timestampBeforeBid = blockBeforeBid.timestamp;
  
      // Place a bid 5 minutes before the auction ends
      await bid.connect(addr2).bid({ value: ethers.parseEther("1") });
  
      // Save the auction end time after placing a bid
      const auctionEndTimeAfterBid = await bid.auctionEndTime();
  
      // Calculate the expected auction end time.
      const extendedTimeInSeconds = 5 * 60; // 5 minutes in seconds
      const expectedAuctionEndTime = timestampBeforeBid + extendedTimeInSeconds;
  
      // Check if the actual auction end time matches the expected auction end time.
      expect(Number(auctionEndTimeAfterBid)).to.be.closeTo(expectedAuctionEndTime, 1);

    });
  
    it('should refund the previous bidder when a new bid is placed', async function () {
      const { bid, addr1, addr2 } = await loadFixture(deployContractFixture);

      // Save balance of addr1 before placing the bid
      const addr1BalanceBefore: bigint = await ethers.provider.getBalance(addr1);

      // Addr1 places a bid
      const bidAmount1: bigint = ethers.parseEther('1');
      const tx1 = await bid.connect(addr1).bid({ value: bidAmount1 });
      const receipt = await tx1.wait();

      await ethers.provider.send("evm_mine");

      if(!receipt) {
        throw new Error('No receipt');
      }

      // Calculate the cost of the transaction
      const gasUsed: BigNumber = new BigNumber(receipt.gasUsed.toString());
      const gasPrice: BigNumber = new BigNumber(tx1.gasPrice.toString());
      const tx1Cost: BigNumber = gasUsed.times(gasPrice);
      const tx1CostBigInt: bigint = BigInt(tx1Cost.toString());

      // Save balance of addr1 after placing the bid
      const addr1BalanceAfterBid: bigint = await ethers.provider.getBalance(addr1);
      
      // Caculate the expected balance of addr1 after placing the bid
      const expectedBalanceAfterBid: bigint = addr1BalanceBefore - (tx1CostBigInt + bidAmount1);

      // check that the balance of addr1 decreased by the bid amount + tx cost
      expect(expectedBalanceAfterBid).to.equal(addr1BalanceAfterBid);

      // Addr2 places a bid
      const bidAmount2: bigint = ethers.parseEther('2');
      await bid.connect(addr2).bid({ value: bidAmount2 });

      // Calculate the community fee for addr1's bid
      const communityFee: BigNumber = calculateCommunityFee(bidAmount1);
      const communityFeeBigInt: bigint = BigInt(communityFee.toString());

      // Make sure addr1 got refunded the 1 ETH after being outbid
      const addr1BalanceAfterOutbid: bigint = await ethers.provider.getBalance(addr1);

      // Calculate the actual bid amount
      const actualBidAmount1: bigint = bidAmount1 - communityFeeBigInt;
      const expectedBalanceAfterOutbid: bigint = addr1BalanceAfterBid + actualBidAmount1;

      // Check that the balance of addr1 increased by the bid amount
      expect(addr1BalanceAfterOutbid).to.equal(expectedBalanceAfterOutbid);

    });

    it('should reject the request if the bid is lower than the current bid', async function () {
      const { bid, addr1, addr2 } = await loadFixture(deployContractFixture);

      // Addr1 places a bid
      const bidAmount1: bigint = ethers.parseEther('10');
      await bid.connect(addr1).bid({ value: bidAmount1 });

      // Addr2 tries to place a bid that is lower than the current bid
      const bidAmount2: bigint = ethers.parseEther('5');
      await expect(bid.connect(addr2).bid({ value: bidAmount2 })).to.be.revertedWith('Bid amount after fee deduction is not high enough');
    });

    it('should reject the request if the bid is expired', async function () {
      const { bid, addr1 } = await loadFixture(deployContractFixture);

      // Move time forward to 2h 1m after auction started.
      await ethers.provider.send("evm_increaseTime", [7260]);
      await ethers.provider.send("evm_mine");

      // Addr1 places a bid
      const bidAmount1: bigint = ethers.parseEther('10');
      await expect(bid.connect(addr1).bid({ value: bidAmount1 })).to.be.revertedWith('Auction not ongoing');

    });

    it('should withdraw the highest bid after the auction ends', async function () {
      const { bid, owner, addr1 } = await loadFixture(deployContractFixture);

      // Save contract's balance before the first bid
      const contractBalanceBefore: bigint = await ethers.provider.getBalance(await bid.getAddress());
      
      // Expect contract's balance to be 0 before the first bid
      expect(contractBalanceBefore).to.equal(0);
      
      // Addr1 places a bid
      const bidAmount1: bigint = ethers.parseEther('10');
      await bid.connect(addr1).bid({ value: bidAmount1 });
  
      // Move time forward to 2h 1m after auction started.
      await ethers.provider.send("evm_increaseTime", [7260]);
      await ethers.provider.send("evm_mine");

      // Calculate the community fee for addr1's bid
      const communityFee: BigNumber = calculateCommunityFee(bidAmount1);
      const communityFeeBigInt: bigint = BigInt(communityFee.toString());
  
      // Save contract's balance after the first bid
      const contractBalanceAfterBid: bigint = await ethers.provider.getBalance(await bid.getAddress());

      // Expect contract's balance to be the bid amount minus the community fee
      expect(contractBalanceAfterBid).to.equal(bidAmount1 - communityFeeBigInt);
  
      // Save owner's balance before the withdrawal
      const ownerBalanceBefore: bigint = await ethers.provider.getBalance(owner);
  
      // Owner withdraws the highest bid
      const tx = await bid.connect(owner).withdrawAuctionAmount();
      const receipt = await tx.wait();

      if(!receipt) {
        throw new Error('No receipt');
      }

      const gasUsed: BigNumber = new BigNumber(receipt.gasUsed.toString());
      const gasPrice: BigNumber = new BigNumber(tx.gasPrice.toString());
      const txCost: BigNumber = gasUsed.times(gasPrice);
      const txCostBigInt: bigint = BigInt(txCost.toString());
  
      // Save contract's balance after the withdrawal
      const contractBalanceAfter: bigint = await ethers.provider.getBalance(await bid.getAddress());

      // Expect contract's balance to be 0 after the withdrawal
      expect(contractBalanceAfter).to.equal(0);
  
      // Save owner's balance after the withdrawal
      const ownerBalanceAfter: bigint = await ethers.provider.getBalance(owner);

      // Expect owner's balance to be get the highest bid amount minus the tx cost
      expect(ownerBalanceAfter).to.equal(ownerBalanceBefore + bidAmount1 - (txCostBigInt + communityFeeBigInt));
  
  });


  });
});
