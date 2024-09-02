// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract ChainbraryToken is ERC20, Ownable, ReentrancyGuard {
    AggregatorV3Interface public priceFeedToken1;
    AggregatorV3Interface public priceFeedToken2;
    AggregatorV3Interface public priceFeedToken3;

    uint256 public maxPurchaseLimit;
    uint256 public weeklyWithdrawalLimit;
    uint256 public lastUpdateTimestamp;
    uint256 public dailyIncreaseRate; // in basis points eg. 100 = 0.1%

    mapping(address => uint256) public lastWithdrawalTime;
    mapping(address => uint256) public withdrawnAmount;

    event PriceFeedsUpdated(address indexed token1, address indexed token2, address indexed token3);
    event MaxPurchaseLimitUpdated(uint256 newLimit);
    event WeeklyWithdrawalLimitUpdated(uint256 newLimit);
    event DailyIncreaseRateUpdated(uint256 newRate);

    constructor(
        uint256 _initialSupply,
        uint256 _ownerMintAmount,
        address _priceFeedToken1,
        address _priceFeedToken2,
        address _priceFeedToken3
    ) ERC20("ChainbraryToken", "CBT") Ownable(_msgSender()) {
        require(_ownerMintAmount <= _initialSupply, "Owner mint amount cannot exceed total supply");

        _mint(_msgSender(), _ownerMintAmount * 10 ** decimals()); // Mint chosen amount to the owner (_msgSender())
        _mint(address(this), _initialSupply * 10 ** decimals() - (_ownerMintAmount * 10 ** decimals())); // Mint the rest to the contract itself

        priceFeedToken1 = AggregatorV3Interface(_priceFeedToken1);
        priceFeedToken2 = AggregatorV3Interface(_priceFeedToken2);
        priceFeedToken3 = AggregatorV3Interface(_priceFeedToken3);

        maxPurchaseLimit = 1000 * 10 ** decimals();
        weeklyWithdrawalLimit = 100 * 10 ** decimals();
        lastUpdateTimestamp = block.timestamp;
    }

    modifier onlyAfterLockPeriod() {
        require(block.timestamp >= lastUpdateTimestamp + 14 days, "Update locked for 2 weeks");
        _;
    }

    function updateDailyIncreaseRate(uint256 _dailyIncreaseRate) external onlyOwner {
        dailyIncreaseRate = _dailyIncreaseRate;
        emit DailyIncreaseRateUpdated(_dailyIncreaseRate);
    }

    function updatePriceFeeds(
        address _priceFeedToken1,
        address _priceFeedToken2,
        address _priceFeedToken3
    ) external onlyOwner onlyAfterLockPeriod {
        priceFeedToken1 = AggregatorV3Interface(_priceFeedToken1);
        priceFeedToken2 = AggregatorV3Interface(_priceFeedToken2);
        priceFeedToken3 = AggregatorV3Interface(_priceFeedToken3);

        lastUpdateTimestamp = block.timestamp;

        emit PriceFeedsUpdated(_priceFeedToken1, _priceFeedToken2, _priceFeedToken3);
    }

    function buyTokens(uint256 amount) public payable nonReentrant {
        require(amount <= maxPurchaseLimit, "Purchase exceeds max limit");
        require(msg.value > 0, "Send native token to purchase");

        uint256 cbTokenAmount = getExponentialPrice(msg.value);
        require(cbTokenAmount > 0, "Insufficient amount to buy tokens");
        _transfer(address(this), _msgSender(), cbTokenAmount);
    }

    function getExponentialPrice(uint256 paymentAmount) public view returns (uint256) {
        uint256 token1Price = getPrice(priceFeedToken1);
        uint256 token2Price = getPrice(priceFeedToken2);
        uint256 token3Price = getPrice(priceFeedToken3);

        // Calculate the average price
        uint256 averagePrice = (token1Price + token2Price + token3Price) / 3;

        // Calculate the time-based exponential multiplier
        uint256 timeElapsed = block.timestamp / 1 days;
        uint256 exponentialMultiplier = (10 ** decimals() * (1 + timeElapsed) ** 2) / 1e6;

        // Apply the exponential multiplier to the average price
        uint256 adjustedPrice = (averagePrice * exponentialMultiplier) / 10 ** decimals();

        uint256 cbTokenAmount = (paymentAmount * 10 ** decimals()) / adjustedPrice;
        return cbTokenAmount;
    }

    function getPrice(AggregatorV3Interface priceFeed) public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price) * 10 ** decimals();
    }

    function withdrawFunds(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        payable(owner()).transfer(amount);
    }

    function setMaxPurchaseLimit(uint256 _limit) external onlyOwner onlyAfterLockPeriod {
        maxPurchaseLimit = _limit;
        lastUpdateTimestamp + 14 days;
        emit MaxPurchaseLimitUpdated(_limit);
    }

    function setWeeklyWithdrawalLimit(uint256 _limit) external onlyOwner onlyAfterLockPeriod {
        weeklyWithdrawalLimit = _limit;
        lastUpdateTimestamp + 14 days;
        emit WeeklyWithdrawalLimitUpdated(_limit);
    }

    function setdailyIncreaseRate(uint256 _rate) external onlyOwner onlyAfterLockPeriod {
        dailyIncreaseRate = _rate;
        lastUpdateTimestamp + 14 days;
        emit DailyIncreaseRateUpdated(_rate);
    }
}
