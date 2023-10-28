// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract TransactionTokenBridge is Ownable, ReentrancyGuard {
    uint256 public feeRate = 1000; // 1000 means 0.1% fee (1/1000)

    constructor() Ownable(_msgSender()) {}

    event Transfer(address indexed sender, address indexed destination, uint256 amount, address token);

    function canTransfer(address _owner, uint256 _amount, IERC20 _token) public view returns (bool) {
        return _token.allowance(_owner, address(this)) >= _amount;
    }

    function transfer(uint256 _amount, address _destinationAddress, IERC20 _token) external nonReentrant {
        require(canTransfer(_msgSender(), _amount, _token), "Contract not approved to transfer enough tokens");

        (bool feeMulSuccess, uint256 feeMulAmount) = Math.tryMul(_amount, feeRate);
        require(feeMulSuccess, "Multiplication overflow");

        (bool feeDivSuccess, uint256 feeAmount) = Math.tryDiv(feeMulAmount, 10000);
        require(feeDivSuccess, "Division overflow");

        (bool feeSubSuccess, uint256 transferAmount) = Math.trySub(_amount, feeAmount);
        require(feeSubSuccess, "Subtraction underflow");

        require(_token.transferFrom(_msgSender(), address(this), _amount), "Token transfer to contract failed");

        require(_token.transfer(owner(), feeAmount), "Fee transfer failed");

        require(_token.transfer(_destinationAddress, transferAmount), "Destination transfer failed");

        emit Transfer(_msgSender(), _destinationAddress, transferAmount, address(_token));
    }

    function setFeeRate(uint256 _feeRateBasisPoints) external onlyOwner {
        feeRate = _feeRateBasisPoints;
    }
}
