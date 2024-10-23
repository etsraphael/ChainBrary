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

    function addLiquidity(uint256 amount0, uint256 amount1) external nonReentrant {
        require(amount0 > 0 && amount1 > 0, "Amounts must be greater than zero");

        IERC20(token0).safeTransferFrom(msg.sender, address(this), amount0);
        IERC20(token1).safeTransferFrom(msg.sender, address(this), amount1);

        reserve0 += amount0;
        reserve1 += amount1;

        emit Mint(msg.sender, amount0, amount1);
    }

    function removeLiquidity(uint256 liquidity) external nonReentrant onlyOwner {
        require(liquidity > 0, "Liquidity must be greater than zero");
        require(reserve0 > 0 && reserve1 > 0, "No liquidity available");

        uint256 amount0 = Math.min(reserve0, liquidity);
        uint256 amount1 = Math.min(reserve1, liquidity);

        reserve0 -= amount0;
        reserve1 -= amount1;

        IERC20(token0).safeTransfer(msg.sender, amount0);
        IERC20(token1).safeTransfer(msg.sender, amount1);

        emit Burn(msg.sender, amount0, amount1);
    }

    function swap(uint256 amountIn, address tokenIn, address to) external nonReentrant {
        require(amountIn > 0, "AmountIn must be greater than zero");
        require(tokenIn == token0 || tokenIn == token1, "Invalid tokenIn");
        require(to != address(0), "Invalid recipient address");

        address tokenOut = (tokenIn == token0) ? token1 : token0;
        uint256 reserveIn = (tokenIn == token0) ? reserve0 : reserve1;
        uint256 reserveOut = (tokenIn == token0) ? reserve1 : reserve0;

        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        uint256 amountInWithFee = amountIn * (1000000 - fee);
        uint256 amountOut = (amountInWithFee * reserveOut) / (reserveIn * 1000000 + amountInWithFee);

        require(amountOut > 0, "Insufficient output amount");

        if (tokenIn == token0) {
            reserve0 += amountIn;
            reserve1 -= amountOut;
        } else {
            reserve1 += amountIn;
            reserve0 -= amountOut;
        }

        IERC20(tokenOut).safeTransfer(to, amountOut);

        emit Swap(msg.sender, amountIn, amountOut);
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
}
