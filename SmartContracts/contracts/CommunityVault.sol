// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract CommunityVault {
    struct User {
        uint256 amount; // Amount staked by the user
        uint256 rewardDebt; // Reward debt. This is used to track the user's share of deposited rewards.
    }

    mapping(address => User) public users;
    uint256 public totalStaked;
    uint256 public accRewardPerShare; // Accumulated rewards per share, scaled to precision

    uint256 private constant PRECISION = 1e18;

    function getDepositByUser(address _user) public view returns (uint256) {
        return users[_user].amount;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Deposit Ether into the contract to be used as staking
    function deposit() public payable {
        User storage user = users[msg.sender];

        // Update user rewards before changing their stake
        if (user.amount > 0) {
            uint256 pending = ((user.amount * accRewardPerShare) / PRECISION) - user.rewardDebt;
            payable(msg.sender).transfer(pending);
        }

        if (msg.value > 0) {
            user.amount += msg.value;
            totalStaked += msg.value;
        }

        user.rewardDebt = (user.amount * accRewardPerShare) / PRECISION;
    }

    // Withdraw Ether from the contract
    function withdraw() public {
        User storage user = users[msg.sender];
        require(user.amount > 0, "Not enough balance");

        // Update user rewards before changing their stake
        uint256 pending = ((user.amount * accRewardPerShare) / PRECISION) - user.rewardDebt;

        console.log("pending: %s", pending);
        console.log("amount: %s", user.amount);
        console.log("result: %s", pending + user.amount);

        payable(msg.sender).transfer(pending + user.amount);

        totalStaked -= user.amount;
        user.amount = 0;
        user.rewardDebt = 0;
    }

    // View pending rewards of a user
    function pendingReward(address _user) public view returns (uint256) {
        if (totalStaked == 0) {
            return 0;
        }

        User storage user = users[_user];
        uint256 pending = ((user.amount * accRewardPerShare) / PRECISION) - user.rewardDebt;

        return pending;
    }

    // Fallback function to accept incoming ETH as rewards
    receive() external payable {
        if (totalStaked > 0) {
            accRewardPerShare += (msg.value * PRECISION) / totalStaked;
        }
    }
}
