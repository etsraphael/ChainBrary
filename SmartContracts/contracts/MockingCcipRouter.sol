// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import { Client } from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

contract MockingCcipRouter is IRouterClient {

    event MessageSent(bytes32 messageId, address receiver, uint256 amount);

    // Mock implementation of isChainSupported
    function isChainSupported(uint64 chainSelector) external pure override returns (bool supported) {
        require(chainSelector >= 0, "chainSelector must be non-negative");
        return true; // For mocking purposes, we assume all chains are supported
    }

    // Mock implementation of getSupportedTokens
    function getSupportedTokens(uint64 chainSelector) external pure override returns (address[] memory tokens) {
        require(chainSelector >= 0, "chainSelector must be non-negative"); // Just to use the parameter
        return new address[](0);
    }

    // Mock implementation of getFee
    function getFee(uint64 destinationChainSelector, Client.EVM2AnyMessage memory message) 
        external pure override returns (uint256 fee) {
        require(destinationChainSelector >= 0, "Destination chain must be valid");
        require(message.data.length >= 0, "Message cannot be empty");
        return 1; // Mock fee
    }

    // Mock implementation of ccipSend
    function ccipSend(
        uint64 destinationChainSelector,
        Client.EVM2AnyMessage calldata message
    ) external payable override returns (bytes32 messageId) {
        require(destinationChainSelector >= 0, "Destination chain must be valid");
        require(message.data.length >= 0, "Message cannot be empty");

        // Mock generating a messageId
        messageId = keccak256(abi.encodePacked(destinationChainSelector, message.data, block.timestamp));

        // Mock emitting the MessageSent event
        emit MessageSent(messageId, abi.decode(message.data, (address)), 1000); // Assuming 1000 as the mocked amount
        return messageId;
    }
}