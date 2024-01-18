// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "hardhat/console.sol";

contract CommunityVault is Ownable, ReentrancyGuard {
    mapping(address => uint256) public FSBList; // Frozen Stacking Balance List
    mapping(address => uint256) public SBList; // Stacking Balance List
    mapping(address => uint256) public RBList; // Reward Balance List

    uint256 public TSB = 0; // Total Stacking Balance
    uint256 public FSB = 0; // Frozen Stacking Balance
    uint256 public TRB = 0; // Total Reward Blance
    uint256 public currentCycle = 0; // Current Cycle
    uint256 public cycleStartTime; // Cycle start time

    constructor() Ownable(_msgSender()) {
        cycleStartTime = block.timestamp;
    }

    function deposit(uint256 amount) public payable {
        require(amount > 0, "CommunityVault: amount must be greater than 0");
        require(TRB > 0, "CommunityVault: Reards already started to distribute");
        SBList[_msgSender()] += amount;
        TSB += amount;
    }

    receive() external payable {
        TRB += msg.value;
    }
}
