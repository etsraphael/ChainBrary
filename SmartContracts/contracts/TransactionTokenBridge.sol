// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract TransactionTokenBridge is Ownable, ReentrancyGuard {
    uint256 public constant FEE_PERCENT = 1; // 0.1% is represented as 1 / 1000

    constructor() Ownable(_msgSender()) {}

    event Transfer(address indexed sender, address indexed destination, uint256 amount, address token);

    function canTransfer(address _owner, uint256 _amount, IERC20 _token) public view returns (bool) {
        return _token.allowance(_owner, address(this)) >= _amount;
    }

    function transfer(uint256 _amount, address _destinationAddress, IERC20 _token) external nonReentrant {
        // Check if the contract is approved to transfer the amount of tokens
        require(canTransfer(_msgSender(), _amount, _token), "Contract not approved to transfer enough tokens");

        // Calculate the fee
        uint256 fee = Math.mulDiv(_amount, FEE_PERCENT, 1000);

        // Subtract the fee from the amount
        (bool feeSubSuccess, uint256 transferAmount) = Math.trySub(_amount, fee);
        require(feeSubSuccess, "Subtraction underflow");

        // Transfer the tokens to the contract
        require(_token.transferFrom(_msgSender(), address(this), _amount), "Token transfer to contract failed");
        emit Transfer(_msgSender(), address(this), _amount, address(_token));

        // Transfer the fee to the owner
        require(_token.transfer(owner(), fee), "Fee transfer failed");
        emit Transfer(_msgSender(), owner(), fee, address(_token));

        // Transfer the amount to the destination address
        require(_token.transfer(_destinationAddress, transferAmount), "Destination transfer failed");
        emit Transfer(_msgSender(), _destinationAddress, transferAmount, address(_token));
    }
}
