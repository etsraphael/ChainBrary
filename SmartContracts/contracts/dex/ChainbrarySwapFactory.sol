// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Pool.sol";

contract ChainbrarySwapFactory {
    address public owner;
    mapping(address => mapping(address => mapping(uint24 => address))) public getPool;
    uint24[] public feeTiers;

    event PoolCreated(address indexed tokenA, address indexed tokenB, uint24 fee, address pool);

    constructor() {
        owner = msg.sender;
        feeTiers = [500, 3000, 10000];
    }

    function createPool(address tokenA, address tokenB, uint24 fee) external returns (address pool) {
        require(tokenA != tokenB, "Identical tokens");
        require(tokenA != address(0) && tokenB != address(0), "Zero address");
        require(getPool[tokenA][tokenB][fee] == address(0), "Pool exists");

        Pool newPool = new Pool(tokenA, tokenB, fee);
        pool = address(newPool);

        getPool[tokenA][tokenB][fee] = pool;
        getPool[tokenB][tokenA][fee] = pool;

        emit PoolCreated(tokenA, tokenB, fee, pool);
    }
}
