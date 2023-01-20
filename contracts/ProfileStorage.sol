// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Profile {
    struct ProfileStruct {
        string username;
        string description;
    }

    mapping(address => ProfileStruct) public profiles;

    function addProfile(string memory _username, string memory _description) public {
        profiles[msg.sender] = ProfileStruct(_username, _description);
    }

    function updateProfile(string memory _username, string memory _description) public {
        profiles[msg.sender].username = _username;
        profiles[msg.sender].description = _description;
    }

    function getProfile(address _address) public view returns (string memory, string memory) {
        return (profiles[_address].username, profiles[_address].description);
    }
}
