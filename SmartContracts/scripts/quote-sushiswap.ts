import { ethers } from 'ethers';
import { Token } from '@uniswap/sdk-core';

export async function getSushiSwapQuote(
  tokenIn: Token,
  tokenOut: Token,
  networkUrl: string,
  amountInRaw: string // Amount to swap as a string
): Promise<string | null> {
  try {
    // Connect to the network
    const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(networkUrl);

    // SushiSwap Router addresses per network
    const ROUTER_ADDRESSES: { [chainId: number]: string } = {
      1: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F', // Ethereum Mainnet
      137: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506', // Polygon Mainnet
      56: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506', // BSC Mainnet
      42161: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506' // Arbitrum Mainnets
    };

    const routerAddress: string = ROUTER_ADDRESSES[tokenIn.chainId];

    if (!routerAddress) {
      return null;
    }

    // Router ABI
    const ROUTER_ABI: string[] = [
      'function getAmountsOut(uint256 amountIn, address[] memory path) external view returns (uint256[] memory amounts)'
    ];

    // Create router contract instance
    const routerContract: ethers.Contract = new ethers.Contract(routerAddress, ROUTER_ABI, provider);

    // Amount of tokenIn to swap
    const amountIn: bigint = ethers.parseUnits(amountInRaw, tokenIn.decimals);

    // Path
    const path: string[] = [tokenIn.address, tokenOut.address];

    // Get quote
    const amountsOut: ethers.BigNumberish[] = await routerContract.getAmountsOut(amountIn, path);

    const amountOut: string = ethers.formatUnits(amountsOut[1], tokenOut.decimals);
    return amountOut;
  } catch (error) {
    return null;
  }
}
