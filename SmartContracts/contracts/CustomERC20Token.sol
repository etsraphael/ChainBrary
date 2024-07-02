// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract ERC20Token is Initializable, ERC20Upgradeable, ERC20PermitUpgradeable, OwnableUpgradeable {
    bool private _isMintable;

    constructor() {
        _disableInitializers();
    }

    function initialize(
        address initialOwner,
        string memory name,
        string memory symbol,
        bool mintable
    ) public initializer {
        __ERC20_init(name, symbol);
        __ERC20Permit_init(name);
        __Ownable_init(initialOwner);
        _isMintable = mintable;
    }

    modifier onlyIfMintable() {
        require(_isMintable, "Token is not mintable");
        _;
    }

    function mint(address to, uint256 amount) public onlyIfMintable onlyOwner {
        _mint(to, amount);
    }

    function isMintable() public view returns (bool) {
        return _isMintable;
    }
}

contract ERC20TokenFactory is OwnableUpgradeable {
    event TokenCreated(address indexed tokenAddress, address indexed owner, bool mintable);

    function createToken(
        address initialAuthority,
        string memory name,
        string memory symbol,
        bool mintable
    ) external returns (address) {
        ERC20Token newToken = new ERC20Token();
        newToken.initialize(initialAuthority, name, symbol, mintable);
        newToken.transferOwnership(_msgSender());

        emit TokenCreated(address(newToken), _msgSender(), mintable);
        return address(newToken);
    }
}
