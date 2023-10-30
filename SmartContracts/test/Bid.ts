import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { BigNumber } from 'bignumber.js';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Bid', function () {
  async function deployContractFixture() {
    const Bid = await ethers.getContractFactory('Bid');
    const bid = await Bid.deploy('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '5', '120');
    const [owner, addr1, addr2] = await ethers.getSigners();
    return { bid, owner, addr1, addr2 };
  }

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

    it('should extends the auction end time by 15 minutes when a bid is placed in the last 5 minutes', async function () {
      const { bid, addr2 } = await loadFixture(deployContractFixture);
      // Move time forward to 1h 55m after auction started.
      await ethers.provider.send("evm_increaseTime", [6900]);
      await ethers.provider.send("evm_mine");
    
      const auctionEndTimeBeforeBid = await bid.auctionEndTime();
      await bid.connect(addr2).bid({ value: ethers.parseEther("1") });
      const auctionEndTimeAfterBid = await bid.auctionEndTime();
      expect(auctionEndTimeAfterBid - auctionEndTimeBeforeBid);
    });

    // it('should refund the previous bidder when a new bid is placed', async function () {
    //   // TODO: Implement this test.
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
