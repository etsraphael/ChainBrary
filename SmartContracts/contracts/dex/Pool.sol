// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract Pool is Ownable, ReentrancyGuard, Initializable {
    using SafeERC20 for IERC20;

    address public token0;
    address public token1;
    uint24 public fee; // Fee in hundredths of a bip

    uint256 public reserve0;
    uint256 public reserve1;

    mapping(address => uint256) public liquidityProvided0;
    mapping(address => uint256) public liquidityProvided1;

    event Swap(address indexed sender, uint256 amountIn, uint256 amountOut);
    event Mint(address indexed sender, uint256 amount0, uint256 amount1);
    event Burn(address indexed sender, uint256 amount0, uint256 amount1);

    constructor() Ownable(_msgSender()) {}

    function initialize(address _token0, address _token1, uint24 _fee) external initializer onlyOwner {
        require(_token0 != _token1, "Tokens must be different");
        require(_fee > 0 && _fee < 1000000, "Invalid fee");

        token0 = _token0;
        token1 = _token1;
        fee = _fee;
    }

    function addLiquidity(uint256 amount0, uint256 amount1) external payable nonReentrant {
        require(amount0 > 0 || amount1 > 0, "Amounts must be greater than zero");

        if (token0 == address(0)) {
            require(msg.value == amount0, "Incorrect native token amount");
            reserve0 += msg.value;
            liquidityProvided0[_msgSender()] += msg.value;
        } else {
            uint256 allowance0 = IERC20(token0).allowance(_msgSender(), address(this));
            require(allowance0 >= amount0, "Insufficient allowance for token0");
            IERC20(token0).safeTransferFrom(_msgSender(), address(this), amount0);
            reserve0 += amount0;
            liquidityProvided0[_msgSender()] += amount0;
        }

        if (token1 == address(0)) {
            require(msg.value == amount1, "Incorrect native token amount");
            reserve1 += msg.value;
            liquidityProvided1[_msgSender()] += msg.value;
        } else {
            uint256 allowance1 = IERC20(token1).allowance(_msgSender(), address(this));
            require(allowance1 >= amount1, "Insufficient allowance for token1");
            IERC20(token1).safeTransferFrom(_msgSender(), address(this), amount1);
            reserve1 += amount1;
            liquidityProvided1[_msgSender()] += amount1;
        }

        emit Mint(_msgSender(), amount0, amount1);
    }

    function removeLiquidity(uint256 liquidity) external nonReentrant {
        require(liquidity > 0, "Liquidity must be greater than zero");
        require(reserve0 > 0 && reserve1 > 0, "No liquidity available");

        uint256 userLiquidity0 = liquidityProvided0[_msgSender()];
        uint256 userLiquidity1 = liquidityProvided1[_msgSender()];

        require(userLiquidity0 > 0 && userLiquidity1 > 0, "No liquidity provided by user");

        uint256 amount0 = Math.min(userLiquidity0, (liquidity * reserve0) / (reserve0 + reserve1));
        uint256 amount1 = Math.min(userLiquidity1, (liquidity * reserve1) / (reserve0 + reserve1));

        require(amount0 > 0 && amount1 > 0, "Insufficient liquidity to withdraw");

        reserve0 -= amount0;
        reserve1 -= amount1;

        liquidityProvided0[_msgSender()] -= amount0;
        liquidityProvided1[_msgSender()] -= amount1;

        if (token0 == address(0)) {
            payable(_msgSender()).transfer(amount0);
        } else {
            IERC20(token0).safeTransfer(_msgSender(), amount0);
        }

        if (token1 == address(0)) {
            payable(_msgSender()).transfer(amount1);
        } else {
            IERC20(token1).safeTransfer(_msgSender(), amount1);
        }

        emit Burn(_msgSender(), amount0, amount1);
    }

    // use 1e18 scale for precision
    function swap(uint256 amountIn, address tokenIn, address to) external payable nonReentrant {
        require(amountIn > 0, "AmountIn must be greater than zero");
        require(tokenIn == token0 || tokenIn == token1, "Invalid tokenIn");
        require(to != address(0), "Invalid recipient address");

        // Determine the output token and reserves based on the input token
        address tokenOut = (tokenIn == token0) ? token1 : token0;
        uint256 reserveIn = (tokenIn == token0) ? reserve0 : reserve1;
        uint256 reserveOut = (tokenIn == token0) ? reserve1 : reserve0;

        // Transfer the input tokens from the sender to the contract
        if (tokenIn == address(0)) {
            require(msg.value == amountIn, "Incorrect native token amount");
        } else {
            IERC20(tokenIn).safeTransferFrom(_msgSender(), address(this), amountIn);
        }

        // Calculate the input amount after deducting the fee
        uint256 amountInWithFee = (amountIn * (1000000 - fee)) / 1000000;
        // Calculate the output amount using the constant product formula
        uint256 amountOut = (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);

        // Ensure the output amount is greater than zero
        require(amountOut > 0, "Insufficient output amount");

        // Calculate the fee amount
        uint256 feeAmount = amountIn - amountInWithFee;
        // Transfer the fee to the contract owner
        if (tokenIn == address(0)) {
            payable(owner()).transfer(feeAmount);
        } else {
            IERC20(tokenIn).safeTransfer(owner(), feeAmount);
        }

        // Update the reserves based on the input and output amounts
        if (tokenIn == token0) {
            reserve0 += amountIn;
            reserve1 -= amountOut;
        } else {
            reserve1 += amountIn;
            reserve0 -= amountOut;
        }

        // Transfer the output tokens to the recipient
        if (tokenOut == address(0)) {
            payable(to).transfer(amountOut);
        } else {
            IERC20(tokenOut).safeTransfer(to, amountOut);
        }

        // Emit a Swap event
        emit Swap(_msgSender(), amountIn, amountOut);
    }

    function getReserves(address tokenA, address tokenB) external view returns (uint256 reserveA, uint256 reserveB) {
        if (tokenA == token0 && tokenB == token1) {
            reserveA = reserve0;
            reserveB = reserve1;
        } else if (tokenA == token1 && tokenB == token0) {
            reserveA = reserve1;
            reserveB = reserve0;
        } else {
            revert("Invalid token pair");
        }
    }

    function getLiquidityProvided(address user) external view returns (uint256, uint256) {
        return (liquidityProvided0[user], liquidityProvided1[user]);
    }

    function getPoolDetails() external view returns (address, address, uint24, uint256, uint256) {
        return (token0, token1, fee, reserve0, reserve1);
    }
}
