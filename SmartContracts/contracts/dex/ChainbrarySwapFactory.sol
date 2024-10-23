// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Pool.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract ChainbrarySwapFactory is Ownable, Initializable {
    mapping(address => mapping(address => mapping(uint24 => address))) public getPool;
    uint24[] public feeTiers;

    event PoolCreated(address indexed tokenA, address indexed tokenB, uint24 fee, address pool);

    constructor() Ownable(_msgSender()) {}

    function initialize() external initializer onlyOwner {
        feeTiers = [500, 3000, 10000];
    }

    function createPool(address tokenA, address tokenB, uint24 fee) external onlyOwner returns (address pool) {
        require(tokenA != tokenB, "Identical tokens");
        require(tokenA != address(0) && tokenB != address(0), "Zero address");
        require(getPool[tokenA][tokenB][fee] == address(0), "Pool exists");

        // Deploy the Pool contract
        Pool newPool = new Pool();

        // Initialize the Pool contract
        newPool.initialize(tokenA, tokenB, fee);
        pool = address(newPool);

        getPool[tokenA][tokenB][fee] = pool;
        getPool[tokenB][tokenA][fee] = pool;

        emit PoolCreated(tokenA, tokenB, fee, pool);
    }
}
