// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract DocumentLocker is Ownable, ReentrancyGuard {
    // public values
    string public documentName;
    string public ownerName;
    uint public unlockingPrice;
    address public communityAddress;
    uint256 private constant FEE_PERCENT = 1; // 0.1% is represented as 1 / 1000
    address public accessAddress;

    // private values
    string private documentDesc;

    modifier onlyAuthorized() {
        require(owner() == _msgSender() || accessAddress == _msgSender(), "no_access");
        _;
    }

    constructor(
        address _communityAddress,
        string memory _documentName,
        string memory _ownerName,
        uint _unlockingPrice,
        string memory _documentDesc
    ) Ownable(_msgSender()) {
        communityAddress = _communityAddress;
        documentName = _documentName;
        ownerName = _ownerName;
        unlockingPrice = _unlockingPrice;
        documentDesc = _documentDesc;
    }

    function calculateFee(uint256 _amount) internal pure returns (uint256) {
        return Math.mulDiv(_amount, FEE_PERCENT, 1000);
    }

    function unlockFile() public payable nonReentrant {
        require(msg.value >= unlockingPrice, "not_enough_funds");

        uint256 fee = calculateFee(msg.value);
        (bool amountAfterFeeSuccess, uint256 amountAfterFee) = Math.trySub(msg.value, fee);
        require(amountAfterFeeSuccess, "calculation_error");

        payable(communityAddress).transfer(fee);
        payable(owner()).transfer(amountAfterFee);

        accessAddress = _msgSender();
    }

    function getDocumentData() public view returns (string memory, string memory, uint, address, address) {
        return (documentName, ownerName, unlockingPrice, owner(), accessAddress);
    }

    function getFullDocumentData()
        public
        view
        onlyAuthorized
        returns (string memory, string memory, uint, string memory, address)
    {
        return (documentName, ownerName, unlockingPrice, documentDesc, accessAddress);
    }
}
