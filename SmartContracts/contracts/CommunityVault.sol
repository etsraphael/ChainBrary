// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract CommunityVault is Ownable, ReentrancyGuard {
    struct User {
        uint256 amount; // Amount staked by the user
        uint256 rewardDebt; // Reward debt. This is used to track the user's share of deposited rewards.
    }

    mapping(address => User) public users;
    uint256 public totalStaked;
    uint256 public accRewardPerShare; // Accumulated rewards per share, scaled to precision
    uint256 private constant PRECISION = 1e18;

    event WithdrawEvent(address indexed to, uint256 value);
    event DepositEvent(address indexed user, uint256 amount);

    constructor() Ownable(_msgSender()) {}

    function getDepositByUser(address _user) public view returns (uint256) {
        return users[_user].amount;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Deposit Ether into the contract to be used as staking
    function deposit() public payable {
        require(msg.value > 0, "Amount_must_be_greater_than_0");

        User storage user = users[_msgSender()];

        // Update user rewards before changing their stake
        if (user.amount > 0) {
            (bool mulSuccess, uint256 mulResult) = Math.tryMul(user.amount, accRewardPerShare);
            require(mulSuccess, "Multiplication failed");

            (bool divSuccess, uint256 divResult) = Math.tryDiv(mulResult, PRECISION);
            require(divSuccess, "Division failed");

            uint256 pending = divResult - user.rewardDebt;
            payable(_msgSender()).transfer(pending);
        }

        if (msg.value > 0) {
            user.amount += msg.value;
            totalStaked += msg.value;
        }

        (, uint256 updatedRewardDebt) = Math.tryMul(user.amount, accRewardPerShare);
        user.rewardDebt = updatedRewardDebt / PRECISION;

        emit DepositEvent(_msgSender(), msg.value);
    }

    // Withdraw Ether from the contract
    function withdraw() public nonReentrant {
        User storage user = users[_msgSender()];
        require(user.amount > 0, "Not enough balance");

        // Update user rewards before changing their stake
        (bool mulSuccess, uint256 mulResult) = Math.tryMul(user.amount, accRewardPerShare);
        require(mulSuccess, "Multiplication failed");

        (bool divSuccess, uint256 divResult) = Math.tryDiv(mulResult, PRECISION);
        require(divSuccess, "Division failed");

        uint256 pending = divResult - user.rewardDebt;

        payable(_msgSender()).transfer(pending + user.amount);

        totalStaked -= user.amount;
        user.amount = 0;
        user.rewardDebt = 0;

        emit WithdrawEvent(_msgSender(), pending + user.amount);
    }

    // View pending rewards of a user
    function pendingReward(address _user) public view returns (uint256) {
        if (totalStaked == 0) {
            return 0;
        }

        User storage user = users[_user];

        (bool mulSuccess, uint256 mulResult) = Math.tryMul(user.amount, accRewardPerShare);
        require(mulSuccess, "Multiplication failed");

        (bool divSuccess, uint256 divResult) = Math.tryDiv(mulResult, PRECISION);
        require(divSuccess, "Division failed");

        uint256 pending = divResult - user.rewardDebt;

        return pending;
    }

    // Fallback function to accept incoming ETH as rewards
    receive() external payable {
        if (totalStaked > 0) {
            (bool mulSuccess, uint256 mulResult) = Math.tryMul(msg.value, PRECISION);
            require(mulSuccess, "Multiplication failed");

            (bool divSuccess, uint256 divResult) = Math.tryDiv(mulResult, totalStaked);
            require(divSuccess, "Division failed");

            accRewardPerShare += divResult;
        }
    }

    // get CommunityVault metadata
    function getCommunityVaultMetadata() public view returns (uint256, uint256, uint256) {
        return (totalStaked, accRewardPerShare, address(this).balance);
    }
    
}
