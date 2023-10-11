// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TransactionBridge is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    uint256 public feeRate = 1000; // 1000 means 0.1% fee (1/1000)
    uint256 public constant MAX_RECIPIENTS = 100; // Prevents too high gas cost

    event Transfer(address indexed from, address indexed to, uint256 value, uint256 fee);

    function transferFund(address payable[] memory recipients) external payable nonReentrant {
        uint256 numOfRecipients = recipients.length;
        require(
            numOfRecipients > 0 && numOfRecipients <= MAX_RECIPIENTS,
            "TransactionBridge: Invalid number of recipients"
        );

        uint256 fee = msg.value.mul(feeRate).div(100000);
        uint256 totalAmount = msg.value.sub(fee);
        uint256 amountPerRecipient = totalAmount.div(numOfRecipients);
        uint256 remainder = totalAmount.mod(numOfRecipients);

        require(amountPerRecipient > 0, "TransactionBridge: Insufficient funds sent to cover transfers and fees");

        payable(owner()).transfer(fee);

        for (uint256 i = 0; i < numOfRecipients; i++) {
            require(recipients[i] != address(0), "TransactionBridge: recipient cannot be the zero address");
            uint256 amountToTransfer = amountPerRecipient;
            if (i == 0 && remainder > 0) {
                amountToTransfer = amountToTransfer.add(remainder); // Add the remainder to the first recipient
            }
            recipients[i].transfer(amountToTransfer);
            emit Transfer(msg.sender, recipients[i], amountToTransfer, fee);
        }
    }
}
