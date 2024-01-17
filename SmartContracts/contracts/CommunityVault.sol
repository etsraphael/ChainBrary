// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "hardhat/console.sol";

contract CommunityVault is Ownable, ReentrancyGuard {
    mapping(address => uint256) public SBList; // Stacking Balance List
    mapping(address => uint256) public RBAList; // Reward Balance Adjusted List

    uint256 public TSB = 0; // Total Stacking Balance
    uint256 public TRBA = 0; // Total Reward Balance Adjusted
    uint256 public TRB = 0; // Total Reward Balance

    constructor() Ownable(_msgSender()) {}

    event WithdrawEvent(address indexed to, uint256 value);
    event DepositEvent(address indexed user, uint256 amount);

    function deposit() public payable {
        require(msg.value > 0, "Amount must be greater than 0");

        // check if reward already exists
        if (TRB > 0) {
            uint256 scaleFactor = 1e18;
            uint256 scaledDivision = (msg.value * scaleFactor) / (TSB + msg.value);
            uint256 rewardBalanceAdjusted = (scaledDivision * TRB) / scaleFactor;
            uint256 stackingAmount = msg.value - rewardBalanceAdjusted;

            RBAList[_msgSender()] += rewardBalanceAdjusted;
            SBList[_msgSender()] += stackingAmount;

            TSB += stackingAmount;
            TRBA += rewardBalanceAdjusted;
        }
        // if not, add to stacking balance
        else {
            SBList[_msgSender()] += msg.value;
            TSB += msg.value;
        }

        emit DepositEvent(_msgSender(), msg.value);
    }

    function getDepositAmount(address user) public view returns (uint256) {
        return SBList[user] + RBAList[user];
    }

    function getRewardBalance(address user) public view returns (uint256) {
        uint256 scaleFactor = 1e18;
        uint256 rewardForStacking = (SBList[user] * scaleFactor * TRB) / TSB;

        if (RBAList[user] > 0) {
            uint256 rewardBalanced = ((getDepositAmount(user) * scaleFactor) / getTotalStackingBalance()) * ((TRBA + TRB) / scaleFactor);

            // TODO: remove console.log after all tests
            console.log("getDepositAmount : ", getDepositAmount(user));
            console.log("TSB : ", TSB);
            console.log("RBAList[user] : ", RBAList[user]);
            console.log("TRBA : ", TRBA);
            console.log("SBList[user]", SBList[user]);
            console.log("TRB : ", TRB);
            console.log("rewardForStacking : ", rewardForStacking / scaleFactor);
            console.log("rewardBalanced : ", rewardBalanced);

            console.log("result : ", rewardBalanced - RBAList[user]);

            return rewardBalanced - RBAList[user];
        }

        return rewardForStacking / scaleFactor;
    }

    function getTotalStackingBalance() public view returns (uint256) {
        return TSB + TRBA;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getTotalRewardBalance() public view returns (uint256) {
        return address(this).balance - TRBA - TSB;
    }

    function withdrawAccount() public nonReentrant {
        // get stacking amount
        uint256 stackingAmount = SBList[_msgSender()];
        require(stackingAmount > 0, "Amount must be greater than 0");

        // get reward amount
        uint256 rewardAmount = getRewardBalance(_msgSender());

        // get withdraw amount
        uint256 withdrawAmount = stackingAmount + rewardAmount;

        // update total values
        TSB -= stackingAmount;
        TRBA -= RBAList[_msgSender()];
        TRB -= rewardAmount;

        // Update the stacking and reward balances
        SBList[_msgSender()] = 0;
        RBAList[_msgSender()] = 0;

        // transfer the full amount
        payable(_msgSender()).transfer(withdrawAmount);
        emit WithdrawEvent(_msgSender(), withdrawAmount);
    }

    receive() external payable {
        TRB += msg.value;
    }
}
