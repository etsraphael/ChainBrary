// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TokenBridge is Ownable, ReentrancyGuard {
    uint256 public feeRateBasisPoints;

    event Transfer(address indexed sender, address indexed destination, uint256 amount, address token);

    constructor(uint256 _feeRateBasisPoints) {
        require(_feeRateBasisPoints <= 10000, "Fee rate should be <= 10000 basis points");
        feeRateBasisPoints = _feeRateBasisPoints;
    }

    function canTransfer(address _owner, uint256 _amount, IERC20 _token) public view returns (bool) {
        return _token.allowance(_owner, address(this)) >= _amount;
    }

    function transfer(uint256 _amount, address _destinationAddress, IERC20 _token) external nonReentrant {
        require(canTransfer(_msgSender(), _amount, _token), "Contract not approved to transfer enough tokens");

        uint256 feeAmount = (_amount * feeRateBasisPoints) / 10000;
        uint256 transferAmount = _amount - feeAmount;

        require(_token.transferFrom(_msgSender(), address(this), _amount), "Transfer failed");

        require(_token.transfer(owner(), feeAmount), "Fee transfer failed");

        require(_token.transfer(_destinationAddress, transferAmount), "Destination transfer failed");

        emit Transfer(_msgSender(), _destinationAddress, transferAmount, address(_token));
    }

    function setFeeRate(uint256 _feeRateBasisPoints) external onlyOwner {
        require(_feeRateBasisPoints <= 10000, "Fee rate should be <= 10000 basis points");
        feeRateBasisPoints = _feeRateBasisPoints;
    }
}
