// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ChainbrarySwapFactory.sol";
import "./Pool.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

contract ChainbrarySwapRouter is Ownable, ReentrancyGuard, Initializable {
    using SafeERC20 for IERC20;

    ChainbrarySwapFactory public factory;
    address public ccipRouter; // CCIP Router address

    event CrossChainSwapInitiated(address indexed sender, address indexed receiver, bytes32 messageId);
    event CrossChainSwapReceived(address indexed receiver, bytes32 messageId);

    constructor() Ownable(_msgSender()) {}

    function initialize(address _factory, address _ccipRouter) external initializer onlyOwner {
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
    ) external nonReentrant {
        require(path.length >= 2, "Invalid path");
        require(fees.length == path.length - 1, "Invalid fees length");

        uint256[] memory amounts = getAmountsOut(amountIn, path, fees);
        require(amounts[amounts.length - 1] >= amountOutMin, "Insufficient output amount");

        IERC20(path[0]).safeTransferFrom(msg.sender, address(this), amounts[0]);

        for (uint256 i = 0; i < path.length - 1; i++) {
            address poolAddress = factory.getPool(path[i], path[i + 1], fees[i]);
            Pool pool = Pool(poolAddress);

            IERC20(path[i]).approve(poolAddress, amounts[i]);

            pool.swap(amounts[i], path[i], address(this));
        }

        IERC20(path[path.length - 1]).safeTransfer(to, amounts[amounts.length - 1]);
    }

    function crossChainSwap(
        uint64 destinationChainSelector,
        address[] memory path,
        uint24[] memory fees,
        uint256 amountIn,
        uint256 amountOutMin,
        address receiver
    ) external payable nonReentrant {
        require(path.length >= 2, "Invalid path");
        require(fees.length == path.length - 1, "Invalid fees length");

        uint256[] memory amounts = getAmountsOut(amountIn, path, fees);
        require(amounts[amounts.length - 1] >= amountOutMin, "Insufficient output amount");

        IERC20(path[0]).safeTransferFrom(msg.sender, address(this), amounts[0]);

        for (uint256 i = 0; i < path.length - 2; i++) {
            address poolAddress = factory.getPool(path[i], path[i + 1], fees[i]);
            require(poolAddress != address(0), "Pool doesn't exist");

            Pool pool = Pool(poolAddress);
            IERC20(path[i]).approve(poolAddress, amounts[i]);

            pool.swap(amounts[i], path[i], address(this));
        }

        uint256 crossChainAmount = amounts[amounts.length - 2];
        address crossChainToken = path[path.length - 2];

        IERC20(crossChainToken).approve(ccipRouter, crossChainAmount);

        Client.EVM2AnyMessage memory message = prepareCrossChainMessage(receiver, crossChainToken, crossChainAmount);

        uint256 fee = getCrossChainFee(destinationChainSelector, message);
        require(msg.value >= fee, "Insufficient fee");

        bytes32 messageId = IRouterClient(ccipRouter).ccipSend{value: fee}(destinationChainSelector, message);

        emit CrossChainSwapInitiated(msg.sender, receiver, messageId);
    }

    function prepareCrossChainMessage(
        address receiver,
        address crossChainToken,
        uint256 crossChainAmount
    ) internal pure returns (Client.EVM2AnyMessage memory) {
        Client.EVMTokenAmount[] memory tokensToSendDetails = new Client.EVMTokenAmount[](1);
        tokensToSendDetails[0] = Client.EVMTokenAmount({token: crossChainToken, amount: crossChainAmount});

        bytes memory data = abi.encode(receiver);

        return
            Client.EVM2AnyMessage({
                receiver: abi.encode(receiver),
                data: data,
                tokenAmounts: tokensToSendDetails,
                extraArgs: "",
                feeToken: address(0)
            });
    }

    function getCrossChainFee(
        uint64 destinationChainSelector,
        Client.EVM2AnyMessage memory message
    ) internal view returns (uint256) {
        return IRouterClient(ccipRouter).getFee(destinationChainSelector, message);
    }

    function ccipReceive(Client.Any2EVMMessage calldata message) external {
        require(msg.sender == ccipRouter, "Only CCIP Router can call");

        address receiver = abi.decode(message.data, (address));

        uint256 length = message.destTokenAmounts.length;
        for (uint256 i = 0; i < length; i++) {
            IERC20(message.destTokenAmounts[i].token).safeTransfer(receiver, message.destTokenAmounts[i].amount);
        }

        emit CrossChainSwapReceived(receiver, message.messageId);
    }

    function crossChainSingleTokenTransfer(
        uint64 destinationChainSelector,
        address token,
        uint256 amount,
        address receiver
    ) external payable nonReentrant {
        require(amount > 0, "Amount must be greater than zero");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        IERC20(token).approve(ccipRouter, amount);

        Client.EVM2AnyMessage memory message = prepareCrossChainMessage(receiver, token, amount);

        uint256 fee = getCrossChainFee(destinationChainSelector, message);
        require(msg.value >= fee, "Insufficient fee");

        bytes32 messageId = IRouterClient(ccipRouter).ccipSend{value: fee}(destinationChainSelector, message);

        emit CrossChainSwapInitiated(msg.sender, receiver, messageId);
    }
}
