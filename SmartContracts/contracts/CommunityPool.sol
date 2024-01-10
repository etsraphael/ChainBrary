// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract CommunityPool is Ownable, ReentrancyGuard {
    mapping(address => uint256) public stackingBalances;
    mapping(address => uint256) public rewardBalances;
    uint256 public totalStackingBalance;

    constructor() Ownable(_msgSender()) {}

    event Transfer(address indexed from, address indexed to, uint256 value);

    function deposit() public payable {
        stackingBalances[_msgSender()] += msg.value;
        totalStackingBalance += msg.value;
    }

    function getStackingBalance(address user) public view returns (uint256) {
        return stackingBalances[user];
    }

    function getRewardBalance(address user) public view returns (uint256) {
        return rewardBalances[user];
    }

    function getTotalStackingBalance() public view returns (uint256) {
        return totalStackingBalance;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getTotalRewardBalance() public view returns (uint256) {
        return address(this).balance - totalStackingBalance;
    }

    function withdrawAccount() public nonReentrant {
        uint256 stackingAmount = stackingBalances[_msgSender()];

        require(stackingAmount > 0, "Amount must be greater than 0");

        // Update the stacking and reward balances
        stackingBalances[_msgSender()] = 0;
        rewardBalances[_msgSender()] = 0;
        totalStackingBalance = totalStackingBalance - stackingAmount;

        uint256 rewardAmount = rewardBalances[_msgSender()];

        payable(_msgSender()).transfer(rewardAmount);

        emit Transfer(address(this), _msgSender(), rewardAmount);
    }
}
