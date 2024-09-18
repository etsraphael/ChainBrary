// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract CollectivePayment is Ownable, ReentrancyGuard, AutomationCompatible {
    uint256 public pricePerParticipant;
    uint256 public requiredParticipants;
    uint256 public timeout;
    address payable public destination;
    uint256 public startTime;
    uint256 public totalCollected;
    bool public fundsTransferred;

    mapping(address => uint256) public contributions;
    address[] public participants;

    constructor() Ownable(_msgSender()) {}

    function initiateTransaction(
        uint256 _pricePerParticipant,
        uint256 _requiredParticipants,
        uint256 _timeout,
        address payable _destination
    ) external onlyOwner {
        require(startTime == 0, "Transaction already initiated");
        require(_destination != address(0), "Invalid destination address");
        require(_pricePerParticipant > 0, "Price must be greater than zero");
        require(_requiredParticipants > 0, "Participants must be greater than zero");
        require(_timeout > 0, "Timeout must be greater than zero");

        pricePerParticipant = _pricePerParticipant;
        requiredParticipants = _requiredParticipants;
        timeout = _timeout;
        destination = _destination;
        startTime = block.timestamp;
    }

    function participate() external payable nonReentrant {
        require(startTime > 0, "Transaction not initiated");
        require(block.timestamp <= startTime + timeout, "Participation period has ended");
        require(msg.value == pricePerParticipant, "Incorrect amount sent");
        require(contributions[msg.sender] == 0, "Already participated");

        contributions[msg.sender] = msg.value;
        participants.push(msg.sender);
        totalCollected += msg.value;

        if (participants.length == requiredParticipants) {
            transferFunds();
        }
    }

    function transferFunds() internal {
        require(!fundsTransferred, "Funds already transferred");
        require(participants.length == requiredParticipants, "Required participants not met");

        fundsTransferred = true;
        (bool success, ) = destination.call{value: totalCollected}("");
        require(success, "Transfer failed");
    }

    function refundParticipants() public nonReentrant {
        require(block.timestamp > startTime + timeout, "Timeout not reached");
        require(!fundsTransferred, "Funds already transferred");

        for (uint256 i = 0; i < participants.length; i++) {
            address payable participant = payable(participants[i]);
            uint256 amount = contributions[participant];
            contributions[participant] = 0;
            (bool success, ) = participant.call{value: amount}("");
            require(success, "Refund failed");
        }
    }

    // Chainlink Automation functions
    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory) {
        upkeepNeeded = (block.timestamp > startTime + timeout) && !fundsTransferred;
    }

    function performUpkeep(bytes calldata) external override {
        if ((block.timestamp > startTime + timeout) && !fundsTransferred) {
            refundParticipants();
        }
    }
}
