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
    uint256 public extendTimeInMinutes;
    bool public auctionAmountWithdrawn = false;

    // List of all bidders
    Bidder[] public bidders;
    struct Bidder {
        address bidderAddress;
        uint256 amount;
    }

    struct BidMetaData {
        string bidName;
        string ownerName;
        string description;
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
    event FallbackCalled(address indexed sender);

    modifier auctionOngoing() {
        require(block.timestamp >= auctionStartTime && block.timestamp <= auctionEndTime, "auction_not_ongoing");
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
        string memory bidName,
        string memory ownerName,
        string memory description
    ) Ownable(_msgSender()) {
        communityAddress = _communityAddress;
        extendTimeInMinutes = _extendTimeInMinutes;
        startAuction(_durationInMinutes);
        bidMetaData = BidMetaData({
            bidName: bidName,
            owner: _msgSender(),
            imgLists: _imgLists,
            ownerName: ownerName,
            description: description
        });
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
        require(msg.value > highestBid, "bid_amount_not_high_enough");
        require(_msgSender() != highestBidder, "already_highest_bidder");

        uint256 refundAmount = highestBid;
        address previousHighestBidder = highestBidder;

        // If the bidder hasn't bid before, add to the bidderAddresses array.
        if (bids[_msgSender()] == 0) {
            bidderAddresses.push(_msgSender());
        }

        bids[_msgSender()] = msg.value;
        highestBidder = _msgSender();
        highestBid = msg.value;

        // Refund the previous highest bidder
        if (previousHighestBidder != address(0)) {
            payable(previousHighestBidder).transfer(refundAmount);
        }

        emit NewBid(_msgSender(), msg.value);
    }

    function withdrawAuctionAmount() external onlyOwner auctionEnded {
        require(!auctionAmountWithdrawn, "Auction amount already withdrawn");

        uint256 fee = calculateFee(highestBid);
        uint256 amountAfterFee = highestBid - fee;

        payable(communityAddress).transfer(fee);
        payable(owner()).transfer(amountAfterFee);

        auctionAmountWithdrawn = true;
        emit Withdrawal(owner(), amountAfterFee);
        emit CommunityTransfer(communityAddress, fee);
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

    function getCompleteBidMetaData()
        public
        view
        returns (
            string[] memory,
            string memory,
            address,
            uint256,
            uint256,
            uint256,
            string memory,
            string memory,
            uint256,
            bool
        )
    {
        return (
            bidMetaData.imgLists,
            bidMetaData.bidName,
            bidMetaData.owner,
            auctionStartTime,
            auctionEndTime,
            extendTimeInMinutes,
            bidMetaData.ownerName,
            bidMetaData.description,
            highestBid,
            auctionAmountWithdrawn
        );
    }

    fallback() external {
        emit FallbackCalled(msg.sender);
    }
}
