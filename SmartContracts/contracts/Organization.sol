// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Organization is Ownable {
    using SafeMath for uint256;

    // Values
    uint256 public MIN_MONTHLY_TRANSACTION = 591666666666666 wei;
    uint256 public MAX_DAYS = 365;
    uint256 private COMMISSION_RATE = 1000; // 0.1% commission rate
    uint256 private MIN_PRICE_PER_DAY = MIN_MONTHLY_TRANSACTION.div(30);

    // Orgnization events
    event OrganizationAdded(string name, string key, string supportUrl, address manager, uint256 pricePerDay);
    event OrganizationEdited(string name, string key, string supportUrl, address manager, uint256 pricePerDay);
    event OrganizationDeleted(string key);
    event OrganizationSaved(string name, string key, string supportUrl, address manager, uint256 pricePerDay);

    // Member account events
    event MemberAccountAdded(
        address indexed userAddress,
        string userName,
        string imgUrl,
        string description,
        uint256 expirationDate
    );
    event MemberAccountEdited(address indexed userAddress, string userName, string imgUrl, string description);
    event MemberAccountDeleted(address indexed userAddress);
    event MemberAccountSaved(
        address indexed userAddress,
        string userName,
        string imgUrl,
        string description,
        uint256 expirationDate,
        string organizationKey
    );

    // Transaction events
    event Transfer(address indexed from, address indexed to, uint256 value);

    // Structs
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

    // Modifiers
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

    modifier minTransaction(uint256 _amount) {
        require(_amount >= MIN_MONTHLY_TRANSACTION, "Minimum transaction not met");
        _;
    }

    modifier minPricePerDay(uint256 _pricePerDay) {
        require(_pricePerDay >= MIN_PRICE_PER_DAY, "Minimum required price per month not met");
        _;
    }

    modifier transactionRangeForAccount(string memory _key) {
        require(msg.value >= MIN_PRICE_PER_DAY, "Minimum transaction not met");
        require(msg.value >= organizations[_key].pricePerDay, "Not enough ETH sent for a day.");
        require(
            msg.value <= organizations[_key].pricePerDay.mul(MAX_DAYS),
            "Maximum days exceeded. You can't subscribe for more than a year."
        );
        _;
    }

    // View Functions
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

    // Edit Functions
    function addOrganization(
        string memory _name,
        string memory _key,
        string memory _supportUrl,
        uint256 _pricePerDay
    ) public validateOrganizationParams(_name, _key, _supportUrl) minPricePerDay(_pricePerDay) {
        require(organizations[_key].manager == address(0), "Organization key already exists.");
        emit OrganizationAdded(_name, _key, _supportUrl, _msgSender(), _pricePerDay);
        emit OrganizationSaved(_name, _key, _supportUrl, _msgSender(), _pricePerDay);
        organizations[_key].name = _name;
        organizations[_key].key = _key;
        organizations[_key].supportUrl = _supportUrl;
        organizations[_key].manager = _msgSender();
        organizations[_key].pricePerDay = _pricePerDay;
    }

    function editOrganization(
        string memory _key,
        string memory _name,
        string memory _supportUrl,
        uint256 _pricePerDay
    ) public organizationNotNull(_key) organizationManager(_key) minPricePerDay(_pricePerDay) {
        emit OrganizationEdited(_name, _key, _supportUrl, _msgSender(), _pricePerDay);
        emit OrganizationSaved(_name, _key, _supportUrl, _msgSender(), _pricePerDay);
        organizations[_key].name = _name;
        organizations[_key].supportUrl = _supportUrl;
        organizations[_key].manager = _msgSender();
        organizations[_key].pricePerDay = _pricePerDay;
    }

    function deleteOrganization(string memory _key) public organizationNotNull(_key) organizationManager(_key) {
        emit OrganizationSaved(
            organizations[_key].name,
            organizations[_key].key,
            organizations[_key].supportUrl,
            _msgSender(),
            0
        );
        emit OrganizationDeleted(_key);
        delete organizations[_key];
    }

    function addAccount(
        string memory _organizationKey,
        string memory _userName,
        string memory _imgUrl,
        string memory _description
    )
        public
        payable
        organizationNotNull(_organizationKey)
        memberAccountAlreadyExists(_organizationKey)
        transactionRangeForAccount(_organizationKey)
    {
        uint256 pricePerDay = organizations[_organizationKey].pricePerDay;
        uint256 availableDays = msg.value.div(pricePerDay);
        uint256 expirationDate = block.timestamp.add(availableDays.mul(1 days));
        emit MemberAccountAdded(_msgSender(), _userName, _imgUrl, _description, expirationDate);
        emit MemberAccountSaved(_msgSender(), _userName, _imgUrl, _description, expirationDate, _organizationKey);
        emit Transfer(_msgSender(), owner(), msg.value.div(1000));
        emit Transfer(_msgSender(), organizations[_organizationKey].manager, msg.value.sub(msg.value.div(1000)));
        organizations[_organizationKey].accounts[_msgSender()].userAddress = _msgSender();
        organizations[_organizationKey].accounts[_msgSender()].userName = _userName;
        organizations[_organizationKey].accounts[_msgSender()].imgUrl = _imgUrl;
        organizations[_organizationKey].accounts[_msgSender()].description = _description;
        organizations[_organizationKey].accounts[_msgSender()].expirationDate = expirationDate;
        payable(owner()).transfer(msg.value.div(1000));
        payable(organizations[_organizationKey].manager).transfer(msg.value.sub(msg.value.div(1000)));
    }

    function addAmountToAccount(
        string memory _organizationKey
    )
        public
        payable
        organizationNotNull(_organizationKey)
        accountOwner(_organizationKey)
        transactionRangeForAccount(_organizationKey)
    {
        uint256 pricePerDay = organizations[_organizationKey].pricePerDay;
        uint256 availableDays = msg.value.div(pricePerDay);
        uint256 expirationDate = organizations[_organizationKey].accounts[_msgSender()].expirationDate.add(
            availableDays.mul(1 days)
        );
        require(
            expirationDate <= block.timestamp.add(MAX_DAYS.mul(1 days)),
            "Maximum days exceeded. You can't subscribe for more than a year."
        );
        organizations[_organizationKey].accounts[_msgSender()].expirationDate = expirationDate;
        emit Transfer(_msgSender(), owner(), msg.value.div(1000));
        emit Transfer(_msgSender(), organizations[_organizationKey].manager, msg.value.sub(msg.value.div(1000)));
        emit MemberAccountSaved(
            _msgSender(),
            organizations[_organizationKey].accounts[_msgSender()].userName,
            organizations[_organizationKey].accounts[_msgSender()].imgUrl,
            organizations[_organizationKey].accounts[_msgSender()].description,
            expirationDate,
            _organizationKey
        );
        payable(owner()).transfer(msg.value.div(1000));
        payable(organizations[_organizationKey].manager).transfer(msg.value.sub(msg.value.div(1000)));
    }

    function editAccount(
        string memory _organizationKey,
        string memory _userName,
        string memory _imgUrl,
        string memory _description
    ) public organizationNotNull(_organizationKey) accountOwner(_organizationKey) {
        emit MemberAccountEdited(_msgSender(), _userName, _imgUrl, _description);
        emit MemberAccountSaved(
            _msgSender(),
            _userName,
            _imgUrl,
            _description,
            organizations[_organizationKey].accounts[_msgSender()].expirationDate,
            _organizationKey
        );
        organizations[_organizationKey].accounts[_msgSender()].userName = _userName;
        organizations[_organizationKey].accounts[_msgSender()].imgUrl = _imgUrl;
        organizations[_organizationKey].accounts[_msgSender()].description = _description;
    }

    function isAccountCertificateValid(
        string memory _organizationKey,
        address _accountAddress
    ) public view organizationNotNull(_organizationKey) returns (bool) {
        return organizations[_organizationKey].accounts[_accountAddress].expirationDate > block.timestamp;
    }

    function deleteMyAccount(
        string memory _organizationKey
    ) public organizationNotNull(_organizationKey) accountOwner(_organizationKey) {
        emit MemberAccountDeleted(_msgSender());
        emit MemberAccountSaved(
            _msgSender(),
            organizations[_organizationKey].accounts[_msgSender()].userName,
            organizations[_organizationKey].accounts[_msgSender()].imgUrl,
            organizations[_organizationKey].accounts[_msgSender()].description,
            block.timestamp,
            _organizationKey
        );
        delete organizations[_organizationKey].accounts[_msgSender()];
    }

    function editMinTransaction(uint256 _minTransactionValue) public onlyOwner {
        MIN_MONTHLY_TRANSACTION = _minTransactionValue;
    }

    function editMaxDays(uint256 _maxDaysValue) public onlyOwner {
        MAX_DAYS = _maxDaysValue;
    }

    // Backup Functions
    function exportExceed() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
