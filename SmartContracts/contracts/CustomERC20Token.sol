// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";


contract ERC20Token is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, ERC20PermitUpgradeable, OwnableUpgradeable {
    bool private _isMintable;
    bool private _isBurnable;

    constructor() {
        _disableInitializers();
    }

    function initialize(
        address initialOwner,
        string memory name,
        string memory symbol,
        bool mintable,
        bool burnable
    ) public initializer {
        __ERC20_init(name, symbol);
        __ERC20Permit_init(name);
        __Ownable_init(initialOwner);
        _isMintable = mintable;
        _isBurnable = burnable;
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

contract ERC20TokenFactory is OwnableUpgradeable {
    event TokenCreated(address indexed tokenAddress, address indexed owner, bool mintable, bool burnable);

    function createToken(
        address initialAuthority,
        string memory name,
        string memory symbol,
        bool mintable,
        bool burnable
    ) external returns (address) {
        ERC20Token newToken = new ERC20Token();
        newToken.initialize(initialAuthority, name, symbol, mintable, burnable);
        newToken.transferOwnership(_msgSender());

        emit TokenCreated(address(newToken), _msgSender(), mintable, burnable);
        return address(newToken);
    }
}
