// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Organization is Ownable {
    event MemberAccountAdded(
        address indexed userAddress,
        string userName,
        string imgUrl,
        string description,
        uint256 expirationDate
    );

    event MemberAccountEdited(address indexed userAddress, string userName, string imgUrl, string description);

    event MemberAccountDeleted(address indexed userAddress);

    event OrganizationAdded(string name, string key, string supportUrl, address manager, uint256 pricePerDay);

    event OrganizationEdited(string name, string key, string supportUrl, address manager, uint256 pricePerDay);

    event OrganizationDeleted(string key);

    struct MemberAccount {
        address userAddress;
        string userName;
        string imgUrl;
        string description;
        uint256 expirationDate;
    }

    struct OrganizationData {
        string name;
        string key;
        string supportUrl;
        address manager;
        mapping(address => MemberAccount) accounts;
        uint256 pricePerDay;
    }

    mapping(string => OrganizationData) public organizations;

    modifier organizationNotNull(string memory _key) {
        require(organizations[_key].manager != address(0), "Organization key does not exist.");
        _;
    }

    modifier organizationManager(string memory _key) {
        require(
            organizations[_key].manager == _msgSender(),
            "Only the manager has permission to edit an organization."
        );
        _;
    }

    modifier accountOwner(string memory _key) {
        require(organizations[_key].accounts[_msgSender()].userAddress == _msgSender(), "Not authorized");
        _;
    }

    modifier validateOrganizationParams(
        string memory _name,
        string memory _key,
        string memory _supportUrl
    ) {
        require(bytes(_name).length > 0, "Name is required.");
        require(bytes(_key).length > 0, "Key is required.");
        require(bytes(_supportUrl).length > 0, "Support URL is required.");
        _;
    }

    modifier memberAccountAlreadyExists(string memory _key) {
        require(
            organizations[_key].accounts[_msgSender()].userAddress != _msgSender(),
            "Member account already exists."
        );
        _;
    }

    function addOrganization(
        string memory _name,
        string memory _key,
        string memory _supportUrl,
        uint256 _pricePerDay
    ) public validateOrganizationParams(_name, _key, _supportUrl) {
        require(organizations[_key].manager == address(0), "Organization key already exists.");
        emit OrganizationAdded(_name, _key, _supportUrl, _msgSender(), _pricePerDay);
        organizations[_key].name = _name;
        organizations[_key].key = _key;
        organizations[_key].supportUrl = _supportUrl;
        organizations[_key].manager = _msgSender();
        organizations[_key].pricePerDay = _pricePerDay;
    }

    function getOrganizationByManagerAndKey(
        address _manager,
        string memory _key
    ) public view organizationNotNull(_key) returns (string memory, string memory, string memory, address, uint256) {
        require(organizations[_key].manager == _manager, "Organization not found.");
        return (
            organizations[_key].name,
            organizations[_key].key,
            organizations[_key].supportUrl,
            organizations[_key].manager,
            organizations[_key].pricePerDay
        );
    }

    function editOrganization(
        string memory _key,
        string memory _name,
        string memory _supportUrl,
        uint256 _pricePerDay
    ) public organizationNotNull(_key) organizationManager(_key) {
        emit OrganizationEdited(_name, _key, _supportUrl, _msgSender(), _pricePerDay);
        organizations[_key].name = _name;
        organizations[_key].supportUrl = _supportUrl;
        organizations[_key].manager = _msgSender();
        organizations[_key].pricePerDay = _pricePerDay;
    }

    function deleteOrganization(string memory _key) public organizationNotNull(_key) organizationManager(_key) {
        emit OrganizationDeleted(_key);
        delete organizations[_key];
    }

    function addAccount(
        string memory _key,
        string memory _userName,
        string memory _imgUrl,
        string memory _description
    ) public payable organizationNotNull(_key) memberAccountAlreadyExists(_key) {
        uint256 pricePerDay = organizations[_key].pricePerDay;
        require(msg.value >= pricePerDay, "Not enough ETH sent.");
        uint256 availableDays = msg.value / pricePerDay;
        uint256 expirationDate = block.timestamp + availableDays * 1 days;

        emit MemberAccountAdded(_msgSender(), _userName, _imgUrl, _description, expirationDate);
        organizations[_key].accounts[_msgSender()].userAddress = _msgSender();
        organizations[_key].accounts[_msgSender()].userName = _userName;
        organizations[_key].accounts[_msgSender()].imgUrl = _imgUrl;
        organizations[_key].accounts[_msgSender()].description = _description;
        organizations[_key].accounts[_msgSender()].expirationDate = expirationDate;
    }

    function addAmountToAccount(
        string memory _organizationKey
    ) public payable organizationNotNull(_organizationKey) accountOwner(_organizationKey) {
        uint256 pricePerDay = organizations[_organizationKey].pricePerDay;
        require(msg.value >= pricePerDay, "Not enough ETH sent.");
        uint256 availableDays = msg.value / pricePerDay;
        uint256 expirationDate = organizations[_organizationKey].accounts[_msgSender()].expirationDate +
            availableDays *
            1 days;
        organizations[_organizationKey].accounts[_msgSender()].expirationDate = expirationDate;
    }

    function getAccountByOrganizationAndUserAddress(
        string memory _organizationKey,
        address _userAddress
    )
        public
        view
        organizationNotNull(_organizationKey)
        returns (address, string memory, string memory, string memory, uint256)
    {
        require(
            organizations[_organizationKey].accounts[_userAddress].userAddress == _userAddress,
            "Member account not found."
        );
        return (
            organizations[_organizationKey].accounts[_userAddress].userAddress,
            organizations[_organizationKey].accounts[_userAddress].userName,
            organizations[_organizationKey].accounts[_userAddress].imgUrl,
            organizations[_organizationKey].accounts[_userAddress].description,
            organizations[_organizationKey].accounts[_userAddress].expirationDate
        );
    }

    function editAccount(
        string memory _organizationKey,
        string memory _userName,
        string memory _imgUrl,
        string memory _description
    ) public organizationNotNull(_organizationKey) accountOwner(_organizationKey) {
        emit MemberAccountEdited(_msgSender(), _userName, _imgUrl, _description);
        organizations[_organizationKey].accounts[_msgSender()].userName = _userName;
        organizations[_organizationKey].accounts[_msgSender()].imgUrl = _imgUrl;
        organizations[_organizationKey].accounts[_msgSender()].description = _description;
    }

    function deleteMyAccount(
        string memory _organizationKey
    ) public organizationNotNull(_organizationKey) accountOwner(_organizationKey) {
        emit MemberAccountDeleted(_msgSender());
        delete organizations[_organizationKey].accounts[_msgSender()];
    }
}
