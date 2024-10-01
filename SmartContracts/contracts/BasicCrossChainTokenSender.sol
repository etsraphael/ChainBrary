// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";

contract BasicCrossChainTokenSender {
    using SafeERC20 for IERC20;

    event MessageSent(bytes32 messageId);

    receive() external payable {}

    function getSupportedTokens(address router, uint64 chainSelector) external view returns (address[] memory tokens) {
        tokens = IRouterClient(router).getSupportedTokens(chainSelector);
    }

    // Function to send tokens across chains (router and link now passed dynamically)
    function send(
        address router,
        uint64 destinationChainSelector,
        address receiver,
        Client.EVMTokenAmount[] memory tokensToSendDetails
    ) external payable {
        uint256 length = tokensToSendDetails.length;

        for (uint256 i = 0; i < length; ) {
            // Transfer tokens from the sender to the contract
            IERC20(tokensToSendDetails[i].token).safeTransferFrom(
                msg.sender,
                address(this),
                tokensToSendDetails[i].amount
            );
            // Approve the router to spend the tokens
            IERC20(tokensToSendDetails[i].token).approve(router, tokensToSendDetails[i].amount);

            unchecked {
                ++i;
            }
        }

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: abi.encode(""),
            tokenAmounts: tokensToSendDetails,
            extraArgs: "",
            feeToken: address(0)
        });

        uint256 fee = IRouterClient(router).getFee(destinationChainSelector, message);

        bytes32 messageId;

        messageId = IRouterClient(router).ccipSend{value: fee}(destinationChainSelector, message);

        emit MessageSent(messageId);
    }
}
