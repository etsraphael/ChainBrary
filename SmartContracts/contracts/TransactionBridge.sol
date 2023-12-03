// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract TransactionBridge is Ownable, ReentrancyGuard {
    uint256 public constant FEE_PERCENT = 1; // 0.1% is represented as 1 / 1000

    constructor() Ownable(_msgSender()) {}

    event Transfer(address indexed from, address indexed to, uint256 value, uint256 fee);
    event TransferToken(address indexed from, address indexed to, uint256 value, address indexed token);

    function calculateFee(uint256 _amount) internal pure returns (uint256) {
        return Math.mulDiv(_amount, FEE_PERCENT, 1000);
    }

    function canTransferToken(address _owner, uint256 _amount, IERC20 _token) public view returns (bool) {
        return _token.allowance(_owner, address(this)) >= _amount;
    }

    function transferFund(address payable recipient) external payable nonReentrant {
        // Calculate fee for community
        uint256 fee = calculateFee(msg.value);

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

    function transferTokenFund(uint256 _amount, address _destinationAddress, IERC20 _token) external nonReentrant {
        // Check if the contract is approved to transfer the amount of tokens
        require(canTransferToken(_msgSender(), _amount, _token), "Contract not approved to transfer enough tokens");

        // Calculate the fee
        uint256 fee = calculateFee(_amount);

        // Subtract the fee from the amount
        (bool feeSubSuccess, uint256 transferAmount) = Math.trySub(_amount, fee);
        require(feeSubSuccess, "Subtraction underflow");

        // Transfer the tokens to the contract
        require(_token.transferFrom(_msgSender(), address(this), _amount), "Token transfer to contract failed");
        emit TransferToken(_msgSender(), address(this), _amount, address(_token));

        // Transfer the fee to the owner
        require(_token.transfer(owner(), fee), "Fee transfer failed");
        emit TransferToken(_msgSender(), owner(), fee, address(_token));

        // Transfer the amount to the destination address
        require(_token.transfer(_destinationAddress, transferAmount), "Destination transfer failed");
        emit TransferToken(_msgSender(), _destinationAddress, transferAmount, address(_token));
    }

}
