// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

contract CrossChainDEX is ReentrancyGuard {
    using SafeERC20 for IERC20;

    mapping(address => mapping(address => uint256)) public reserves;
    mapping(address => mapping(address => uint256)) public totalLiquidity;
    mapping(address => mapping(address => mapping(address => uint256))) public liquidityProviderBalance;

    // Events
    event LiquidityAdded(
        address indexed provider,
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity
    );
    event LiquidityRemoved(
        address indexed provider,
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity
    );
    event SwapExecuted(address indexed swapper, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    event CrossChainSwapInitiated(address indexed sender, address indexed receiver, bytes32 messageId);
    event CrossChainSwapReceived(address indexed receiver, bytes32 messageId);

    address public router;

    constructor(address _router) {
        router = _router;
    }

    function addLiquidity(address tokenA, address tokenB, uint256 amountA, uint256 amountB) external nonReentrant {
        require(amountA > 0 && amountB > 0, "Invalid amounts");

        // Transfer tokens from the provider to the contract
        IERC20(tokenA).safeTransferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).safeTransferFrom(msg.sender, address(this), amountB);

        // Update reserves
        reserves[tokenA][tokenB] += amountA;
        reserves[tokenB][tokenA] += amountB;

        // Update liquidity
        uint256 liquidity = Math.sqrt(amountA * amountB);
        totalLiquidity[tokenA][tokenB] += liquidity;
        liquidityProviderBalance[tokenA][tokenB][msg.sender] += liquidity;

        emit LiquidityAdded(msg.sender, tokenA, tokenB, amountA, amountB, liquidity);
    }

    function removeLiquidity(address tokenA, address tokenB, uint256 liquidity) external nonReentrant {
        require(liquidity > 0, "Invalid liquidity amount");
        uint256 totalLiq = totalLiquidity[tokenA][tokenB];
        require(totalLiq > 0, "No liquidity in pool");

        uint256 userLiquidity = liquidityProviderBalance[tokenA][tokenB][msg.sender];
        require(userLiquidity >= liquidity, "Insufficient liquidity balance");

        uint256 amountA = (reserves[tokenA][tokenB] * liquidity) / totalLiq;
        uint256 amountB = (reserves[tokenB][tokenA] * liquidity) / totalLiq;

        // Update balances
        liquidityProviderBalance[tokenA][tokenB][msg.sender] -= liquidity;
        totalLiquidity[tokenA][tokenB] -= liquidity;

        reserves[tokenA][tokenB] -= amountA;
        reserves[tokenB][tokenA] -= amountB;

        // Transfer tokens back to the user
        IERC20(tokenA).safeTransfer(msg.sender, amountA);
        IERC20(tokenB).safeTransfer(msg.sender, amountB);

        emit LiquidityRemoved(msg.sender, tokenA, tokenB, amountA, amountB, liquidity);
    }

    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external nonReentrant returns (uint256 amountOut) {
        require(amountIn > 0, "Invalid input amount");
        require(reserves[tokenIn][tokenOut] > 0, "Pool doesn't exist");

        // Transfer the input tokens from the user to the contract
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        // Calculate the output amount using the constant product formula
        uint256 reserveIn = reserves[tokenIn][tokenOut];
        uint256 reserveOut = reserves[tokenOut][tokenIn];
        uint256 amountInWithFee = amountIn * 997; // Assuming a 0.3% fee
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * 1000) + amountInWithFee;
        amountOut = numerator / denominator;

        require(amountOut > 0, "Insufficient output amount");

        // Update reserves
        reserves[tokenIn][tokenOut] += amountIn;
        reserves[tokenOut][tokenIn] -= amountOut;

        // Transfer the output tokens to the user
        IERC20(tokenOut).safeTransfer(msg.sender, amountOut);

        emit SwapExecuted(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }

    function ccipReceive(Client.Any2EVMMessage calldata message) external {
        // Only the router should be able to call this function
        require(msg.sender == router, "Only router can call");

        // Decode the receiver address from message.data
        address receiver = abi.decode(message.data, (address));

        // Transfer tokens to the receiver
        uint256 length = message.destTokenAmounts.length;
        for (uint256 i = 0; i < length; ) {
            IERC20(message.destTokenAmounts[i].token).safeTransfer(receiver, message.destTokenAmounts[i].amount);

            unchecked {
                ++i;
            }
        }

        // Execute any additional logic if needed

        emit CrossChainSwapReceived(receiver, message.messageId);
    }

    function crossChainSwap(
        uint64 destinationChainSelector,
        address receiver,
        Client.EVMTokenAmount[] memory tokensToSendDetails
    ) external payable nonReentrant {
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

        // Encode the receiver address into the data field
        bytes memory data = abi.encode(receiver);

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: "", // Leave empty or use appropriate placeholder
            data: data, // Include the encoded receiver address
            tokenAmounts: tokensToSendDetails,
            extraArgs: "",
            feeToken: address(0) // Use native token for fees
        });

        uint256 fee = IRouterClient(router).getFee(destinationChainSelector, message);

        bytes32 messageId = IRouterClient(router).ccipSend{value: fee}(destinationChainSelector, message);

        emit CrossChainSwapInitiated(msg.sender, receiver, messageId);
    }
}
