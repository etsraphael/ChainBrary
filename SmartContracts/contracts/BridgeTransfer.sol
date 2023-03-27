// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TransactionBridge is Ownable {
    using SafeMath for uint256;

    uint256 public feeRate = 1000; // 1000 means 0.1% fee (1/1000)

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value,
        uint256 fee
    );

    function transferEth(address payable[] memory recipients)
        external
        payable
    {
        uint256 numOfRecipients = recipients.length;
        require(
            numOfRecipients > 0,
            "TransactionBridge: recipients array must not be empty"
        );

        uint256 fee = msg.value.mul(feeRate).div(100000);
        uint256 totalAmount = msg.value.sub(fee);
        uint256 amountPerRecipient = totalAmount.div(numOfRecipients);

        require(
            amountPerRecipient > 0,
            "TransactionBridge: Insufficient funds sent to cover transfers and fees"
        );

        payable(owner()).transfer(fee);

        for (uint256 i = 0; i < numOfRecipients; i++) {
            require(
                recipients[i] != address(0),
                "TransactionBridge: recipient cannot be the zero address"
            );
            recipients[i].transfer(amountPerRecipient);
            emit Transfer(msg.sender, recipients[i], amountPerRecipient, fee);
        }
    }
}
