// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract CommunityPool is Ownable, ReentrancyGuard {
    mapping(address => uint256) public stackingBalances;
    mapping(address => uint256) public rewardBalances;
    uint256 public totalStackingBalance;

    constructor() Ownable(_msgSender()) {}

    event Transfer(address indexed from, address indexed to, uint256 value);

    function deposit() public payable {
        stackingBalances[_msgSender()] += msg.value;
        totalStackingBalance += msg.value;
    }

    function getStackingBalance(address user) public view returns (uint256) {
        return stackingBalances[user];
    }

    function getRewardBalance(address user) public view returns (uint256) {
        return rewardBalances[user];
    }

    function getTotalStackingBalance() public view returns (uint256) {
        return totalStackingBalance;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getTotalRewardBalance() public view returns (uint256) {
        return address(this).balance - totalStackingBalance;
    }

    function withdraw(uint256 amount) public nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= stackingBalances[_msgSender()], "Amount must be less than or equal to stacking balance");

        uint256 rewardAmount = rewardBalances[_msgSender()];
        uint256 totalAmount = amount + rewardAmount;

        require(totalAmount <= address(this).balance, "Insufficient contract balance");

        // Update the stacking and reward balances
        stackingBalances[_msgSender()] -= amount;
        rewardBalances[_msgSender()] = 0; // Assuming the entire reward is withdrawn
        totalStackingBalance -= amount;

        // Transfer the total amount (stacked + reward) to the user
        payable(_msgSender()).transfer(totalAmount);

        emit Transfer(address(this), _msgSender(), totalAmount);
    }
}
