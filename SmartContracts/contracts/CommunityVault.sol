// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "hardhat/console.sol";

contract CommunityVault is Ownable, ReentrancyGuard {
    struct Staker {
        uint256 amount; // Amount staked by the user
        uint256 rewardDebt; // Reward debt (used to calculate correct reward)
    }

    mapping(address => Staker) public stakers;
    uint256 public totalStaked;
    uint256 public lastRewardTime;
    uint256 public accRewardPerShare;
    uint256 public rewardRate; // Reward per second for the entire pool

    constructor() Ownable(_msgSender()) {
        lastRewardTime = block.timestamp;
    }

    // Update reward variables
    function updatePool() internal {
        if (block.timestamp <= lastRewardTime) {
            return;
        }
        if (totalStaked == 0) {
            lastRewardTime = block.timestamp;
            return;
        }

        uint256 duration = block.timestamp - lastRewardTime;
        uint256 reward = duration * rewardRate;
        accRewardPerShare += reward / totalStaked;
        lastRewardTime = block.timestamp;
    }

    // Deposit tokens into the pool for staking
    function deposit(uint256 _amount) public {
        Staker storage user = stakers[msg.sender];
        updatePool();

        // Handle pending rewards
        if (user.amount > 0) {
            uint256 pending = user.amount * accRewardPerShare - user.rewardDebt;
            payable(msg.sender).transfer(pending);
        }

        user.amount += _amount;
        user.rewardDebt = user.amount * accRewardPerShare;
        totalStaked += _amount;
    }

    // Withdraw tokens from the pool
    function withdraw(uint256 _amount) public {
        Staker storage user = stakers[msg.sender];
        require(user.amount >= _amount, "Withdraw: not good");

        updatePool();

        uint256 pending = user.amount * accRewardPerShare - user.rewardDebt;
        payable(msg.sender).transfer(pending);

        user.amount -= _amount;
        user.rewardDebt = user.amount * accRewardPerShare;
        totalStaked -= _amount;
    }


    // Function to add rewards to the pool (can be modified to accept external funding)
    function addRewards(uint256 _amount) external payable {
        require(msg.value == _amount, "Reward amount mismatch");
    }

    // Function to dynamically update the reward rate
    function updateRewardRate(uint256 _newRate) external {
        updatePool(); // Update the pool before changing the rate to ensure proper accounting
        rewardRate = _newRate;
    }
}

// TODO: try this first
