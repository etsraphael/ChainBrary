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

    // it('should extend the auction end time by 15 minutes when a bid is placed in the last 5 minutes', async function () {
    //   const { bid, addr2 } = await loadFixture(deployContractFixture);
    //   // Move time forward to 1h 55m after auction started.
    //   await ethers.provider.send("evm_increaseTime", [6900]);
    //   await ethers.provider.send("evm_mine");

    //   const auctionEndTimeBeforeBid = await bid.auctionEndTime();
    //   await bid.connect(addr2).bid({ value: ethers.parseEther("1") });
    //   const auctionEndTimeAfterBid = await bid.auctionEndTime();
    //   console.log('auctionEndTimeBeforeBid', auctionEndTimeBeforeBid);
    //   console.log('auctionEndTimeAfterBid', auctionEndTimeAfterBid);
    //   console.log('auctionEndTimeAfterBid - auctionEndTimeBeforeBid', auctionEndTimeAfterBid - auctionEndTimeBeforeBid)
    //   console.log('extendTimeInMinutes', bid.extendTimeInMinutes)
    //   expect(auctionEndTimeAfterBid - auctionEndTimeBeforeBid).equal(15 * 60); // 15 minutes in seconds.
    // });

    // it('should refund the previous bidder when a new bid is placed', async function () {
    //   const { bid, addr1, addr2 } = await loadFixture(deployContractFixture);

    //   // Save balance of addr1 before placing the bid
    //   const addr1BalanceBefore: BigNumber = new BigNumber((await ethers.provider.getBalance(addr1)).toString());

    //   // Addr1 places a bid
    //   const bidAmount1: bigint = ethers.parseEther('100');
    //   const tx1 = await bid.connect(addr1).bid({ value: bidAmount1 });
    //   const receipt = await tx1.wait();

    //   await ethers.provider.send("evm_mine");

    //   if(!receipt) {
    //     throw new Error('No receipt');
    //   }

    //   // Calculate the cost of the transaction
    //   const gasUsed: BigNumber = new BigNumber(receipt.gasUsed.toString());
    //   const gasPrice: BigNumber = new BigNumber(tx1.gasPrice.toString());
    //   const tx1Cost: BigNumber = gasUsed.times(gasPrice);

    //   // Calculate the community fee for addr1's bid
    //   const communityFee: BigNumber = calculateCommunityFee(new BigNumber(bidAmount1.toString()));

    //   // Get initial balance of addr2 before placing any bids
    //   const addr2InitialBalance = await ethers.provider.getBalance(addr2.address);

    //   // Addr2 places a bid
    //   // const bidAmount2: bigint = ethers.parseEther('2');
    //   // await bid.connect(addr2).bid({ value: bidAmount2 });
    //   // const addr2BalanceAfterBid = await ethers.provider.getBalance(addr2.address);

    //   // Assert that addr2's balance decreased by 2 ETH after placing the bid
    //   // expect(addr2InitialBalance - addr2BalanceAfterBid).to.equal(bidAmount2);

    //   // Make sure addr1 got refunded the 1 ETH after being outbid
    //   const addr1BalanceAfterOutbid = new BigNumber((await ethers.provider.getBalance(addr1)).toString());

    //   console.log('addr1BalanceBefore', addr1BalanceBefore.toString())
    //   console.log('addr1BalanceAfterOutbid', addr1BalanceAfterOutbid.minus(tx1Cost.plus(communityFee)).toString())

    //   expect(addr1BalanceBefore).to.equal(addr1BalanceAfterOutbid.minus(tx1Cost.plus(communityFee)));

    //   // expect(addr1BalanceBefore).to.equal(addr1BalanceAfterOutbid.minus(tx1Cost.plus(communityFee)));

    // });

    // it('should send the fees to the community treasury', async function () {
    //   // TODO: Implement this test.
    // })

    // it('should reject the request if the bid is lower than the current bid', async function () {
    //   // TODO: Implement this test.
    // });

    // it('should reject the request if the bid is expired', async function () {
    //   // TODO: Implement this test.
    // });


  });
});
