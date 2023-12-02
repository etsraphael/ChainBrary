// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract TransactionBridge is Ownable, ReentrancyGuard {
    uint256 private constant FEE_PERCENT = 1; // 0.1% is represented as 1 / 1000

    constructor() Ownable(_msgSender()) {}

    event Transfer(address indexed from, address indexed to, uint256 value, uint256 fee);

    function transferFund(address payable recipient) external payable nonReentrant {
        // Calculate fee for community
        uint256 fee = Math.mulDiv(msg.value, FEE_PERCENT, 1000);

        // Calculate total amount to be transferred to recipient
        (bool totalAmountSuccess, uint256 totalAmount) = Math.trySub(msg.value, fee);
        require(totalAmountSuccess, "TransactionBridge: Subtraction underflow");

        // Transfer fee to community
        payable(owner()).transfer(fee);

        // Transfer total amount to recipient
        recipient.transfer(totalAmount);

        // Emit event
        emit Transfer(_msgSender(), recipient, totalAmount, fee);
    }
}
