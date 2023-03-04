// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Organization is Ownable {
    event MemberAccountAdded(
        address indexed userAddress,
        string userName,
        string ImgUrl,
        string description,
        uint256 ExpirationDate
    );

    event MemberAccountEdited(
        address indexed userAddress,
        string userName,
        string ImgUrl,
        string description,
        uint256 ExpirationDate
    );

    event MemberAccountDeleted(address indexed userAddress);

    event OrganizationAdded(string name, string key, string supportUrl, address manager);

    event OrganizationEdited(string name, string key, string supportUrl, address manager);

    event OrganizationDeleted(string key);

    struct MemberAccount {
        address userAddress;
        string userName;
        string ImgUrl;
        string description;
        uint256 ExpirationDate;
    }

    struct OrganizationData {
        string name;
        string key;
        string supportUrl;
        address manager;
        mapping(address => MemberAccount) accounts;
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

    function addOrganization(string memory _name, string memory _key, string memory _supportUrl) public {
        require(organizations[_key].manager == address(0), "Organization key already exists.");
        emit OrganizationAdded(_name, _key, _supportUrl, _msgSender());
        organizations[_key].name = _name;
        organizations[_key].key = _key;
        organizations[_key].supportUrl = _supportUrl;
        organizations[_key].manager = _msgSender();
    }

    function editOrganization(
        string memory _key,
        string memory _name,
        string memory _supportUrl
    ) public organizationManager(_key) {
        emit OrganizationEdited(_name, _key, _supportUrl, _msgSender());
        organizations[_key].name = _name;
        organizations[_key].supportUrl = _supportUrl;
        organizations[_key].manager = _msgSender();
    }

    function deleteOrganization(string memory _key) public organizationNotNull(_key) organizationManager(_key) {
        emit OrganizationDeleted(_key);
        delete organizations[_key];
    }

    function addAccount(
        string memory _key,
        string memory _userName,
        string memory _ImgUrl,
        string memory _description,
        uint256 _ExpirationDate
    ) public organizationNotNull(_key) {
        emit MemberAccountAdded(_msgSender(), _userName, _ImgUrl, _description, _ExpirationDate);
        organizations[_key].accounts[_msgSender()].userAddress = _msgSender();
        organizations[_key].accounts[_msgSender()].userName = _userName;
        organizations[_key].accounts[_msgSender()].ImgUrl = _ImgUrl;
        organizations[_key].accounts[_msgSender()].description = _description;
        organizations[_key].accounts[_msgSender()].ExpirationDate = _ExpirationDate;
    }

    function editAccount(
        string memory _key,
        string memory _userName,
        string memory _ImgUrl,
        string memory _description,
        uint256 _ExpirationDate
    ) public accountOwner(_key) {
        emit MemberAccountEdited(_msgSender(), _userName, _ImgUrl, _description, _ExpirationDate);
        organizations[_key].accounts[_msgSender()].userName = _userName;
        organizations[_key].accounts[_msgSender()].ImgUrl = _ImgUrl;
        organizations[_key].accounts[_msgSender()].description = _description;
        organizations[_key].accounts[_msgSender()].ExpirationDate = _ExpirationDate;
    }

    function deleteMyAccount(string memory _key) public accountOwner(_key) {
        emit MemberAccountDeleted(_msgSender());
        delete organizations[_key].accounts[_msgSender()];
    }
}
