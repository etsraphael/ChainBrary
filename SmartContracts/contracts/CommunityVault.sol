// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract CommunityVault is Ownable, ReentrancyGuard {
    mapping(address => uint256) public stackingBalances;
    mapping(address => uint256) public rewardBalancesAdjusted;

    uint256 public totalStackingBalance;
    uint256 public totalRewardBalancesAdjusted;
    uint256 public totalRewardBalance;

    constructor() Ownable(_msgSender()) {}

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Deposit(address indexed user, uint256 amount);

    function deposit() public payable {
        // check if reward already exists
        if (totalRewardBalance > 0) {
            uint256 rewardBalanceAdjusted = (msg.value / totalStackingBalance) * totalRewardBalance;
            uint256 stackingAmount = msg.value - rewardBalanceAdjusted;

            rewardBalancesAdjusted[_msgSender()] += rewardBalanceAdjusted;
            stackingBalances[_msgSender()] += stackingAmount;

            totalStackingBalance += stackingAmount;
            totalRewardBalancesAdjusted += rewardBalanceAdjusted;
        }
        // if not, add to stacking balance
        else {
            stackingBalances[_msgSender()] += msg.value;
            totalStackingBalance += msg.value;
        }

        emit Deposit(_msgSender(), msg.value);
    }

    function getStackingBalance(address user) public view returns (uint256) {
        return stackingBalances[user] + rewardBalancesAdjusted[user];
    }

    function getRewardBalance(address user) public view returns (uint256) {
        if (rewardBalancesAdjusted[user] == 0) {
            return (stackingBalances[user] / totalStackingBalance) * totalRewardBalance;
        } else {
            return
                ((rewardBalancesAdjusted[user] + stackingBalances[user]) / totalStackingBalance) * totalRewardBalance;
        }
    }

    function getTotalStackingBalance() public view returns (uint256) {
        return totalStackingBalance;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getTotalRewardBalance() public view returns (uint256) {
        return address(this).balance - totalRewardBalancesAdjusted - totalStackingBalance;
    }

    function withdrawAccount() public nonReentrant {
        // get stacking amount
        uint256 stackingAmount = stackingBalances[_msgSender()];
        require(stackingAmount > 0, "Amount must be greater than 0");

        // get reward amount
        uint256 rewardAmount = getRewardBalance(_msgSender());

        // update total values
        totalStackingBalance -= stackingAmount;
        totalRewardBalancesAdjusted -= rewardBalancesAdjusted[_msgSender()];

        // Update the stacking and reward balances
        stackingBalances[_msgSender()] = 0;
        rewardBalancesAdjusted[_msgSender()] = 0;

        // transfer the full amount
        payable(_msgSender()).transfer(rewardAmount);
        emit Transfer(address(this), _msgSender(), rewardAmount);
    }

    receive() external payable {
        totalRewardBalance += msg.value;
    }
}
