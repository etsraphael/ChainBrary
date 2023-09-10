// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TokenBridge is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    uint256 public feeRate = 1000; // 1000 means 0.1% fee (1/1000)

    event Transfer(address indexed sender, address indexed destination, uint256 amount, address token);

    function canTransfer(address _owner, uint256 _amount, IERC20 _token) public view returns (bool) {
        return _token.allowance(_owner, address(this)) >= _amount;
    }

    function transfer(uint256 _amount, address _destinationAddress, IERC20 _token) external nonReentrant {
        require(canTransfer(_msgSender(), _amount, _token), "Contract not approved to transfer enough tokens");

        uint256 feeAmount = _amount.mul(feeRate).div(10000);
        uint256 transferAmount = _amount.sub(feeAmount);

        require(_token.transferFrom(_msgSender(), address(this), _amount), "Token transfer to contract failed");

        require(_token.transfer(owner(), feeAmount), "Fee transfer failed");

        require(_token.transfer(_destinationAddress, transferAmount), "Destination transfer failed");

        emit Transfer(_msgSender(), _destinationAddress, transferAmount, address(_token));
    }

    function setFeeRate(uint256 _feeRateBasisPoints) external onlyOwner {
        feeRate = _feeRateBasisPoints;
    }
}