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

    mapping(address => uint256) public lastWithdrawalTime;
    mapping(address => uint256) public withdrawnAmount;

    event PriceFeedsUpdated(address indexed token1, address indexed token2, address indexed token3);
    event MaxPurchaseLimitUpdated(uint256 newLimit);
    event WeeklyWithdrawalLimitUpdated(uint256 newLimit);

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

        maxPurchaseLimit = 1000 * 10 ** decimals(); // Example limit
        weeklyWithdrawalLimit = 100 * 10 ** decimals(); // Example weekly withdrawal limit

        lastUpdateTimestamp = block.timestamp; // Initialize the last update timestamp
    }

    modifier onlyAfterLockPeriod() {
        require(block.timestamp >= lastUpdateTimestamp + 14 days, "Update locked for 2 weeks");
        _;
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

        uint256 cbTokenAmount = getCBTokenAmountWithMedian(msg.value);
        require(cbTokenAmount > 0, "Insufficient amount to buy tokens");
        _transfer(address(this), _msgSender(), cbTokenAmount);
    }

    function getCBTokenAmountWithMedian(uint256 paymentAmount) public view returns (uint256) {
        uint256 token1Price = getPrice(priceFeedToken1);
        uint256 token2Price = getPrice(priceFeedToken2);
        uint256 token3Price = getPrice(priceFeedToken3);

        // Declare and assign values to the prices array
        uint256[3] memory prices = [token1Price, token2Price, token3Price];

        // Sort prices to find the median
        for (uint256 i = 0; i < prices.length - 1; i++) {
            for (uint256 j = i + 1; j < prices.length; j++) {
                if (prices[i] > prices[j]) {
                    uint256 temp = prices[i];
                    prices[i] = prices[j];
                    prices[j] = temp;
                }
            }
        }
        uint256 medianPrice = prices[1]; // The median price

        uint256 cbTokenAmount = (paymentAmount * 1e18) / medianPrice;
        return cbTokenAmount;
    }

    function getPrice(AggregatorV3Interface priceFeed) public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price * 1e18);
    }

    function withdrawFunds(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        payable(owner()).transfer(amount);
    }

    function setMaxPurchaseLimit(uint256 _limit) external onlyOwner onlyAfterLockPeriod {
        emit MaxPurchaseLimitUpdated(_limit);
        maxPurchaseLimit = _limit;
        lastUpdateTimestamp + 14 days;
    }

    function setWeeklyWithdrawalLimit(uint256 _limit) external onlyOwner onlyAfterLockPeriod {
        emit WeeklyWithdrawalLimitUpdated(_limit);
        weeklyWithdrawalLimit = _limit;
        lastUpdateTimestamp + 14 days;
    }
}
