// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Token is ERC20, ERC20Burnable, Ownable {
    bool _isMintable;
    bool _isBurnable;

    constructor(
        address initialOwner,
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        bool mintable,
        bool burnable
    ) ERC20(name, symbol) Ownable(initialOwner) {
        _isMintable = mintable;
        _isBurnable = burnable;
        _mint(initialOwner, initialSupply * (10 ** decimals()));
    }

    modifier onlyIfMintable() {
        require(_isMintable, "Token is not mintable");
        _;
    }

    modifier onlyIfBurnable() {
        require(_isBurnable, "Token is not burnable");
        _;
    }

    function mint(address to, uint256 amount) public onlyIfMintable {
        _mint(to, amount);
    }

    function isMintable() public view returns (bool) {
        return _isMintable;
    }

    function burn(uint256 amount) public override onlyIfBurnable {
        super.burn(amount);
    }

    function burnFrom(address account, uint256 amount) public override onlyIfBurnable {
        super.burnFrom(account, amount);
    }

    function isBurnable() public view returns (bool) {
        return _isBurnable;
    }
}
