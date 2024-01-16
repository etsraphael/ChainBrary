// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract CommunityVault is Ownable, ReentrancyGuard {
    mapping(address => uint256) public stackingBalances;
    mapping(address => uint256) public rewardBalancesAdjusted;

    uint256 public TSB = 0; // Total Stacking Balance
    uint256 public totalRewardBalancesAdjusted = 0;
    uint256 public totalRewardBalance = 0;

    constructor() Ownable(_msgSender()) {}

    event WithdrawEvent(address indexed to, uint256 value);
    event DepositEvent(address indexed user, uint256 amount);

    function deposit() public payable {
        require(msg.value > 0, "Amount must be greater than 0");

        // check if reward already exists
        if (totalRewardBalance > 0) {
            uint256 scaleFactor = 1e18;
            uint256 scaledDivision = (msg.value * scaleFactor) / (TSB + msg.value);
            uint256 rewardBalanceAdjusted = (scaledDivision * totalRewardBalance) / scaleFactor;
            uint256 stackingAmount = msg.value - rewardBalanceAdjusted;

            rewardBalancesAdjusted[_msgSender()] += rewardBalanceAdjusted;
            stackingBalances[_msgSender()] += stackingAmount;

            TSB += stackingAmount;
            totalRewardBalancesAdjusted += rewardBalanceAdjusted;
        }
        // if not, add to stacking balance
        else {
            stackingBalances[_msgSender()] += msg.value;
            TSB += msg.value;
        }

        emit DepositEvent(_msgSender(), msg.value);
    }

    function getDepositAmount(address user) public view returns (uint256) {
        return stackingBalances[user] + rewardBalancesAdjusted[user];
    }

    function getRewardBalance(address user) public view returns (uint256) {
        uint256 rewardForStacking = (stackingBalances[user] * totalRewardBalance) / TSB;

        if (rewardBalancesAdjusted[user] > 0) {
            return
                (getDepositAmount(user) / TSB) *
                (rewardBalancesAdjusted[user] + totalRewardBalancesAdjusted);
        }

        return rewardForStacking;
    }

    function getTotalStackingBalance() public view returns (uint256) {
        return TSB + totalRewardBalancesAdjusted;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getTotalRewardBalance() public view returns (uint256) {
        return address(this).balance - totalRewardBalancesAdjusted - TSB;
    }

    function withdrawAccount() public nonReentrant {
        // get stacking amount
        uint256 stackingAmount = stackingBalances[_msgSender()];
        require(stackingAmount > 0, "Amount must be greater than 0");

        // get reward amount
        uint256 rewardAmount = getRewardBalance(_msgSender());

        // get withdraw amount
        uint256 withdrawAmount = stackingAmount + rewardAmount;

        // update total values
        TSB -= stackingAmount;
        totalRewardBalancesAdjusted -= rewardBalancesAdjusted[_msgSender()];
        totalRewardBalance -= rewardAmount;

        // Update the stacking and reward balances
        stackingBalances[_msgSender()] = 0;
        rewardBalancesAdjusted[_msgSender()] = 0;

        // transfer the full amount
        payable(_msgSender()).transfer(withdrawAmount);
        emit WithdrawEvent(_msgSender(), withdrawAmount);
    }

    receive() external payable {
        totalRewardBalance += msg.value;
    }
}
