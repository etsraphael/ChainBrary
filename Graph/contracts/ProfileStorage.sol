// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CertifiedProfiles is Ownable {

    struct ProfileStruct {
        address userAddress;
        string username;
        string description;
        uint256 expirationDate;
    }

    mapping(address => ProfileStruct) public profiles;

    modifier profileNotNull() {
        require(profiles[_msgSender()].userAddress != address(0), "Profile not found");
        _;
    }

    modifier profileOwner() {
        require(profiles[_msgSender()].userAddress == _msgSender(), "Not authorized");
        _;
    }

    function addProfile(string memory _username, string memory _description) public {
        require(profiles[_msgSender()].userAddress != _msgSender(), "Profile already exists");
        uint256 oneYearInSeconds = 365 days;
        uint256 expirationDate = block.timestamp + oneYearInSeconds;
        profiles[_msgSender()] = ProfileStruct(_msgSender(), _username, _description, expirationDate);
    }

    function extendExpiredDate() public profileOwner {
        uint256 oneYearInSeconds = 365 days;
        uint256 expirationDate = block.timestamp + oneYearInSeconds;
        profiles[_msgSender()].expirationDate = expirationDate;
    }

    function updateProfile(string memory _username, string memory _description) public profileOwner {
        profiles[_msgSender()].username = _username;
        profiles[_msgSender()].description = _description;
    }

    function getProfile(address _address) public view profileNotNull returns (address, string memory, string memory, uint256)  {
        return (profiles[_address].userAddress, profiles[_address].username, profiles[_address].description, profiles[_address].expirationDate);
    }

    function deleteProfileByAddress(address _address) public profileNotNull onlyOwner {
        delete profiles[_address];
    }

    function deleteMyProfile() public profileOwner {
        delete profiles[_msgSender()];
    }
}
