// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";

contract CustomERC20Token is ERC20, ERC20Burnable, ERC20Pausable, Ownable, ERC20FlashMint {
    bool private _isMintable;
    bool private _isBurnable;
    bool private _isPausable;

    constructor(
        address initialOwner,
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        bool mintable,
        bool burnable,
        bool pausable
    ) ERC20(name, symbol) Ownable(initialOwner) {
        _isMintable = mintable;
        _isBurnable = burnable;
        _isPausable = pausable;
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

    function mint(address to, uint256 amount) public onlyIfMintable onlyOwner {
        _mint(to, amount);
    }

    function isMintable() public view returns (bool) {
        return _isMintable;
    }

    function burn(uint256 amount) public override onlyIfBurnable onlyOwner {
        super.burn(amount);
    }

    function burnFrom(address account, uint256 amount) public override onlyIfBurnable onlyOwner {
        super.burnFrom(account, amount);
    }

    function isBurnable() public view returns (bool) {
        return _isBurnable;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
}
