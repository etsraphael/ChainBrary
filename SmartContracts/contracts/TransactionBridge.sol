// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract TransactionBridge is Ownable, ReentrancyGuard {
    uint256 public feeRate = 1000; // 1000 means 0.1% fee (1/1000)
    uint256 public constant MAX_RECIPIENTS = 100; // Prevents too high gas cost

    constructor() Ownable(_msgSender()) {}

    event Transfer(address indexed from, address indexed to, uint256 value, uint256 fee);

    function transferFund(address payable[] memory recipients) external payable nonReentrant {
        uint256 numOfRecipients = recipients.length;
        require(
            numOfRecipients > 0 && numOfRecipients <= MAX_RECIPIENTS,
            "TransactionBridge: Invalid number of recipients"
        );

        (bool feeMulSuccess, uint256 feeMulAmount) = Math.tryMul(msg.value, feeRate);
        require(feeMulSuccess, "TransactionBridge: Multiplication overflow");

        (bool feeSuccess, uint256 fee) = Math.tryDiv(feeMulAmount, 10000);
        require(feeSuccess, "TransactionBridge: Division overflow");

        (bool totalAmountSuccess, uint256 totalAmount) = Math.trySub(msg.value, fee);
        require(totalAmountSuccess, "TransactionBridge: Subtraction underflow");

        (bool amountPerRecipientSuccess, uint256 amountPerRecipient) = Math.tryDiv(totalAmount, numOfRecipients);
        require(amountPerRecipientSuccess, "TransactionBridge: Division overflow");

        (bool remainderSuccess, uint256 remainder) = Math.tryMod(totalAmount, numOfRecipients);
        require(remainderSuccess, "TransactionBridge: Modulo overflow");

        require(amountPerRecipient > 0, "TransactionBridge: Insufficient funds sent to cover transfers and fees");

        payable(owner()).transfer(fee);

        for (uint256 i = 0; i < numOfRecipients; i++) {
            require(recipients[i] != address(0), "TransactionBridge: recipient cannot be the zero address");
            uint256 amountToTransfer = amountPerRecipient;
            if (i == 0 && remainder > 0) {
                (bool addSuccess, uint256 newAmount) = Math.tryAdd(amountToTransfer, remainder);
                require(addSuccess, "TransactionBridge: Addition overflow");
                amountToTransfer = newAmount;
            }
            recipients[i].transfer(amountToTransfer);
            emit Transfer(msg.sender, recipients[i], amountToTransfer, fee);
        }
    }
}
