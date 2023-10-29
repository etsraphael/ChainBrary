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

    // List of all bidders
    Bidder[] public bidders;
    struct Bidder {
        address bidderAddress;
        uint256 amount;
    }

    address[] public bidderAddresses;
    mapping(address => uint256) public bids;

    event AuctionStarted(uint256 startTime, uint256 endTime);
    event NewBid(address indexed bidder, uint256 amount);
    event Withdrawal(address indexed bidder, uint256 amount);
    event AuctionSuccessful(address indexed bidder, uint256 amount);

    modifier auctionOngoing() {
        require(block.timestamp >= auctionStartTime && block.timestamp <= auctionEndTime, "Auction not ongoing");
        _;
    }

    modifier auctionEnded() {
        require(block.timestamp > auctionEndTime, "Auction hasn't ended yet");
        _;
    }

    constructor(address _communityAddress) Ownable(_msgSender()) {
        communityAddress = _communityAddress; // Initialize dev community address
    }

    function auctionDone() public view returns (bool) {
        return auctionEndTime > block.timestamp;
    }

    function calculateFee(uint256 _amount) internal pure returns (uint256) {
        (bool feeCalculationSuccess, uint256 fee) = Math.tryDiv(FEE_PERCENT, 1000);
        require(feeCalculationSuccess, "Division overflow");

        (bool feeAmountCalculationSuccess, uint256 feeAmount) = Math.tryMul(_amount, fee);
        require(feeAmountCalculationSuccess, "Multiplication overflow");

        return feeAmount;
    }

    function startAuction(uint256 _durationInMinutes) external onlyOwner {
        auctionStartTime = block.timestamp;

        (bool secondConvertionSuccess, uint256 secondConvertion) = Math.tryMul(_durationInMinutes, 60);
        require(secondConvertionSuccess, "Multiplication overflow");

        (bool auctionEndTimeSuccess, uint256 _auctionEndTime) = Math.tryAdd(auctionStartTime, secondConvertion);
        auctionEndTime = _auctionEndTime;
        require(auctionEndTimeSuccess, "Addition overflow");

        emit AuctionStarted(auctionStartTime, auctionEndTime);
    }

    function bid() external payable auctionOngoing nonReentrant {
        uint256 fee = calculateFee(msg.value);

        (bool actualBidAmountCalculationSuccess, uint256 actualBidAmount) = Math.trySub(msg.value, fee);
        require(actualBidAmountCalculationSuccess, "Subtraction overflow");
        
        require(actualBidAmount > highestBid, "Bid amount after fee deduction is not high enough");
        require(msg.sender != highestBidder, "You are already the highest bidder");

        uint256 refundAmount = highestBid;
        address previousHighestBidder = highestBidder;

        // If the bidder hasn't bid before, add to the bidderAddresses array.
        if (bids[msg.sender] == 0) {
            bidderAddresses.push(msg.sender);
        }

        bids[msg.sender] = actualBidAmount;
        highestBidder = msg.sender;
        highestBid = actualBidAmount;

        // Send fee to the dev community address
        payable(communityAddress).transfer(fee);

        // refund the previous highest bidder if applicable
        if (previousHighestBidder != address(0)) {
            payable(previousHighestBidder).transfer(refundAmount);
        }

        emit NewBid(msg.sender, actualBidAmount);
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
}
