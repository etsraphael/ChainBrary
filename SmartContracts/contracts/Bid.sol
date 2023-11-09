// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract Bid is Ownable, ReentrancyGuard {
    uint256 public auctionStartTime;
    uint256 public auctionEndTime;
    address public highestBidder;
    uint256 public highestBid;
    address public communityAddress;
    uint256 private constant FEE_PERCENT = 1; // 0.1% is represented as 1 / 1000
    uint256 public extendTimeInMinutes; // Changed variable name

    // List of all bidders
    Bidder[] public bidders;
    struct Bidder {
        address bidderAddress;
        uint256 amount;
    }

    struct BidMetaData {
        string bidName;
        address owner;
        string[] imgLists;
    }

    BidMetaData public bidMetaData;

    address[] public bidderAddresses;
    mapping(address => uint256) public bids;

    event AuctionStarted(uint256 startTime, uint256 endTime);
    event NewBid(address indexed bidder, uint256 amount);
    event Withdrawal(address indexed bidder, uint256 amount);
    event AuctionSuccessful(address indexed bidder, uint256 amount);
    event CommunityTransfer(address indexed bidder, uint256 amount);

    modifier auctionOngoing() {
        require(block.timestamp >= auctionStartTime && block.timestamp <= auctionEndTime, "Auction not ongoing");
        _;
    }

    modifier auctionEnded() {
        require(block.timestamp > auctionEndTime, "Auction hasn't ended yet");
        _;
    }

    constructor(
        address _communityAddress,
        uint256 _extendTimeInMinutes,
        uint256 _durationInMinutes,
        string[] memory _imgLists,
        string memory bidName
    ) Ownable(_msgSender()) {
        communityAddress = _communityAddress;
        extendTimeInMinutes = _extendTimeInMinutes;
        startAuction(_durationInMinutes);
        bidMetaData = BidMetaData({bidName: bidName, owner: _msgSender(), imgLists: _imgLists});
    }

    function auctionDone() public view returns (bool) {
        return auctionEndTime > block.timestamp;
    }

    function calculateFee(uint256 _amount) internal pure returns (uint256) {
        return Math.mulDiv(_amount, FEE_PERCENT, 1000);
    }

    function startAuction(uint256 _durationInMinutes) internal {
        auctionStartTime = block.timestamp;

        (bool secondConversionSuccess, uint256 secondConversion) = Math.tryMul(_durationInMinutes, 60);
        require(secondConversionSuccess, "Multiplication overflow");

        (bool auctionEndTimeSuccess, uint256 _auctionEndTime) = Math.tryAdd(auctionStartTime, secondConversion);
        auctionEndTime = _auctionEndTime;
        require(auctionEndTimeSuccess, "Addition overflow");

        emit AuctionStarted(auctionStartTime, auctionEndTime);
    }

    function bid() external payable auctionOngoing nonReentrant {
        uint256 fee = calculateFee(msg.value);

        (bool actualBidAmountCalculationSuccess, uint256 actualBidAmount) = Math.trySub(msg.value, fee);
        require(actualBidAmountCalculationSuccess, "Subtraction overflow");

        require(actualBidAmount > highestBid, "Bid amount after fee deduction is not high enough");
        require(_msgSender() != highestBidder, "You are already the highest bidder");

        uint256 refundAmount = highestBid;
        address previousHighestBidder = highestBidder;

        // If the bidder hasn't bid before, add to the bidderAddresses array.
        if (bids[_msgSender()] == 0) {
            bidderAddresses.push(_msgSender());
        }

        bids[_msgSender()] = actualBidAmount;
        highestBidder = _msgSender();
        highestBid = actualBidAmount;

        // If the auction is about to end, extend the auction by the extendTimeInMinutes
        if (auctionEndTime - block.timestamp <= 10 minutes) {
            (bool extendedTimeSuccess, uint256 extendedTime) = Math.tryMul(extendTimeInMinutes, 60);
            require(extendedTimeSuccess, "Multiplication overflow");
            auctionEndTime = block.timestamp + extendedTime;
        }

        // Transfer the fee to the community address
        payable(communityAddress).transfer(fee);
        emit CommunityTransfer(_msgSender(), fee);

        // Refund the previous highest bidder
        if (previousHighestBidder != address(0)) {
            payable(previousHighestBidder).transfer(refundAmount);
        }

        emit NewBid(_msgSender(), actualBidAmount);
    }

    function withdrawAuctionAmount() external onlyOwner auctionEnded {
        payable(owner()).transfer(highestBid);
        emit Withdrawal(owner(), highestBid);
        emit AuctionSuccessful(highestBidder, highestBid);
    }

    function getAllBiddersWithAmounts() external view returns (address[] memory, uint256[] memory) {
        uint256 length = bidderAddresses.length;
        uint256[] memory amounts = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            amounts[i] = bids[bidderAddresses[i]];
        }

        return (bidderAddresses, amounts);
    }

    function getCompleteBidMetaData() public view returns (string[] memory, string memory, address) {
        return (bidMetaData.imgLists, bidMetaData.bidName, bidMetaData.owner);
    }
}
