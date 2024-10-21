// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ChainbrarySwapFactory.sol";
import "./Pool.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

contract ChainbrarySwapRouter {
    using SafeERC20 for IERC20;

    ChainbrarySwapFactory public factory;
    address public ccipRouter; // CCIP Router address

    event CrossChainSwapInitiated(address indexed sender, address indexed receiver, bytes32 messageId);
    event CrossChainSwapReceived(address indexed receiver, bytes32 messageId);

    constructor(address _factory, address _ccipRouter) {
        factory = ChainbrarySwapFactory(_factory);
        ccipRouter = _ccipRouter;
    }

    function getAmountsOut(
        uint256 amountIn,
        address[] memory path,
        uint24[] memory fees
    ) public view returns (uint256[] memory amounts) {
        require(path.length >= 2, "Invalid path");
        require(fees.length == path.length - 1, "Invalid fees length");

        amounts = new uint256[](path.length);
        amounts[0] = amountIn;

        for (uint256 i = 0; i < path.length - 1; i++) {
            address poolAddress = factory.getPool(path[i], path[i + 1], fees[i]);
            require(poolAddress != address(0), "Pool doesn't exist");
            Pool pool = Pool(poolAddress);

            (uint256 reserveIn, uint256 reserveOut) = pool.getReserves(path[i], path[i + 1]);

            uint256 amountInWithFee = amounts[i] * (1000000 - fees[i]);
            uint256 amountOut = (amountInWithFee * reserveOut) / (reserveIn * 1000000 + amountInWithFee);

            amounts[i + 1] = amountOut;
        }
    }

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] memory path,
        uint24[] memory fees,
        address to
    ) external {
        require(path.length >= 2, "Invalid path");
        require(fees.length == path.length - 1, "Invalid fees length");

        uint256[] memory amounts = getAmountsOut(amountIn, path, fees);
        require(amounts[amounts.length - 1] >= amountOutMin, "Insufficient output amount");

        IERC20(path[0]).transferFrom(msg.sender, address(this), amounts[0]);

        for (uint256 i = 0; i < path.length - 1; i++) {
            address poolAddress = factory.getPool(path[i], path[i + 1], fees[i]);
            Pool pool = Pool(poolAddress);

            IERC20(path[i]).approve(poolAddress, amounts[i]);

            pool.swap(amounts[i], path[i], address(this));
        }

        IERC20(path[path.length - 1]).transfer(to, amounts[amounts.length - 1]);
    }

    // Cross-Chain Swap Function
    function crossChainSwap(
        uint64 destinationChainSelector,
        address[] memory path,
        uint24[] memory fees,
        uint256 amountIn,
        uint256 amountOutMin,
        address receiver
    ) external payable {
        require(path.length >= 2, "Invalid path");
        require(fees.length == path.length - 1, "Invalid fees length");

        // Get output amounts along the path
        uint256[] memory amounts = getAmountsOut(amountIn, path, fees);
        require(amounts[amounts.length - 1] >= amountOutMin, "Insufficient output amount");

        // Transfer input token from sender to the contract
        IERC20(path[0]).safeTransferFrom(msg.sender, address(this), amounts[0]);

        // Perform swaps up to the last token before the cross-chain transfer
        for (uint256 i = 0; i < path.length - 2; i++) {
            address poolAddress = factory.getPool(path[i], path[i + 1], fees[i]);
            require(poolAddress != address(0), "Pool doesn't exist");

            Pool pool = Pool(poolAddress);
            IERC20(path[i]).approve(poolAddress, amounts[i]);

            pool.swap(amounts[i], path[i], address(this));
        }

        // The last token in the path is what will be transferred cross-chain
        uint256 crossChainAmount = amounts[amounts.length - 2];
        address crossChainToken = path[path.length - 2];

        // Approve the CCIP router to transfer the token cross-chain
        IERC20(crossChainToken).approve(ccipRouter, crossChainAmount);

        // Prepare the cross-chain message
        Client.EVM2AnyMessage memory message = prepareCrossChainMessage(receiver, crossChainToken, crossChainAmount);

        // Get the fee required for sending the message via CCIP
        uint256 fee = getCrossChainFee(destinationChainSelector, message);
        require(msg.value >= fee, "Insufficient fee");

        // Send the cross-chain message
        bytes32 messageId = IRouterClient(ccipRouter).ccipSend{value: fee}(destinationChainSelector, message);

        emit CrossChainSwapInitiated(msg.sender, receiver, messageId);
    }

    function prepareCrossChainMessage(
        address receiver,
        address crossChainToken,
        uint256 crossChainAmount
    ) internal pure returns (Client.EVM2AnyMessage memory) {
        // Create the Client.EVMTokenAmount for cross-chain message
        Client.EVMTokenAmount[] memory tokensToSendDetails = new Client.EVMTokenAmount[](1);
        tokensToSendDetails[0] = Client.EVMTokenAmount({token: crossChainToken, amount: crossChainAmount});

        // Prepare the data for the message (encoded receiver address)
        bytes memory data = abi.encode(receiver);

        // Construct the cross-chain message
        return Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: data,
            tokenAmounts: tokensToSendDetails,
            extraArgs: "",
            feeToken: address(0) // Native token for fees
        });
    }

    function getCrossChainFee(
        uint64 destinationChainSelector,
        Client.EVM2AnyMessage memory message
    ) internal view returns (uint256) {
        return IRouterClient(ccipRouter).getFee(destinationChainSelector, message);
    }

    // CCIP Receive Function
    function ccipReceive(Client.Any2EVMMessage calldata message) external {
        require(msg.sender == ccipRouter, "Only CCIP Router can call");

        // Decode the receiver address from message.data
        address receiver = abi.decode(message.data, (address));

        // Transfer tokens to the receiver
        uint256 length = message.destTokenAmounts.length;
        for (uint256 i = 0; i < length; i++) {
            IERC20(message.destTokenAmounts[i].token).safeTransfer(receiver, message.destTokenAmounts[i].amount);
        }

        emit CrossChainSwapReceived(receiver, message.messageId);
    }
}
