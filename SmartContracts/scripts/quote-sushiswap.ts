// quote-sushiswap.ts

import { ethers } from 'ethers';
import { Token } from '@uniswap/sdk-core';

export async function getSushiSwapQuote(
  tokenIn: Token,
  tokenOut: Token,
  networkUrl: string,
  amountInRaw: string // Amount to swap as a string
): Promise<void> {
  try {
    // Connect to the network
    const provider = new ethers.JsonRpcProvider(networkUrl);

    // SushiSwap Router addresses per network
    const ROUTER_ADDRESSES: { [chainId: number]: string } = {
      1: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F', // Ethereum Mainnet
      137: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506', // Polygon Mainnet
      56: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506', // BSC Mainnet
      // Add other networks as needed
    };

    const routerAddress = ROUTER_ADDRESSES[tokenIn.chainId];

    if (!routerAddress) {
      console.log('SushiSwap is not deployed on this network.');
      return;
    }

    // Router ABI
    const ROUTER_ABI = [
      'function getAmountsOut(uint256 amountIn, address[] memory path) external view returns (uint256[] memory amounts)'
    ];

    // Create router contract instance
    const routerContract = new ethers.Contract(routerAddress, ROUTER_ABI, provider);

    // Amount of tokenIn to swap
    const amountIn = ethers.parseUnits(amountInRaw, tokenIn.decimals);

    // Path
    const path = [tokenIn.address, tokenOut.address];

    // Get quote
    const amountsOut = await routerContract.getAmountsOut(amountIn, path);

    const amountOut = ethers.formatUnits(amountsOut[1], tokenOut.decimals);

    console.log(`Sushiswap Quote: ${amountOut} ${tokenOut.symbol}`);
  } catch (error) {
    console.error('Error getting SushiSwap quote:', error);
  }
}