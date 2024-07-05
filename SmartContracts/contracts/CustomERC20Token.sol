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
        bool pausable,
        address[] memory preAssignedAddresses,
        uint256[] memory preAssignedAmounts
    ) ERC20(name, symbol) Ownable(initialOwner) {
        require(preAssignedAddresses.length == preAssignedAmounts.length, "Mismatched arrays");
        _isMintable = mintable;
        _isBurnable = burnable;
        _isPausable = pausable;
        _mint(initialOwner, initialSupply * (10 ** decimals()));
        for (uint256 i = 0; i < preAssignedAddresses.length; i++) {
            _mint(preAssignedAddresses[i], preAssignedAmounts[i] * (10 ** decimals()));
        }
    }

    modifier onlyIfMintable() {
        require(_isMintable, "TokenNotMintable");
        _;
    }

    modifier onlyIfBurnable() {
        require(_isBurnable, "TokenNotBurnable");
        _;
    }

    modifier onlyIfPausable() {
        require(_isPausable, "TokenNotPausable");
        _;
    }

    function mint(address to, uint256 amount) public onlyOwner onlyIfMintable {
        _mint(to, amount);
    }

    function isMintable() public view returns (bool) {
        return _isMintable;
    }

    function burn(uint256 amount) public override onlyOwner onlyIfBurnable {
        super.burn(amount);
    }

    function burnFrom(address account, uint256 amount) public override onlyOwner onlyIfBurnable {
        super.burnFrom(account, amount);
    }

    function isBurnable() public view returns (bool) {
        return _isBurnable;
    }

    function pause() public onlyOwner onlyIfPausable {
        _pause();
    }

    function unpause() public onlyOwner onlyIfPausable {
        _unpause();
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
}
