// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20FixedSupply is ERC20, Ownable {
    constructor() ERC20("Chainbrary Token", "CB") {
        _mint(msg.sender, 21000000000 * (10 ** uint256(decimals())));
    }
}
