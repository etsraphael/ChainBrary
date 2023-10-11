// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceFeed {
    /**
     * Returns the latest answer from the specified aggregator.
     */
    function getLatestDataFrom(
        address aggregator
    )
        public
        view
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
    {
        AggregatorV3Interface dataFeed = AggregatorV3Interface(aggregator);
        return dataFeed.latestRoundData();
    }
}
