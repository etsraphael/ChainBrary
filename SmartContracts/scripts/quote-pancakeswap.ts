import { ethers } from 'ethers';
import { Token } from '@uniswap/sdk-core';

export async function getPancakeSwapQuote(
  tokenIn: Token,
  tokenOut: Token,
  networkUrl: string,
  amountInRaw: string // Amount to swap as a string
): Promise<void> {
  try {
    // Connect to the network
    const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(networkUrl);

    // PancakeSwap Router addresses per network
    const ROUTER_ADDRESSES: { [chainId: number]: string } = {
      1: '0xEfF92A263d31888d860bD50809A8D171709b7b1c', // Ethereum Mainnet
      56: '0x10ED43C718714eb63d5aA57B78B54704E256024E', // BSC Mainnet
      42161: '0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb' // Arbitrum Mainnets
      // Add other networks if PancakeSwap is deployed on them
    };

    const routerAddress: string = ROUTER_ADDRESSES[tokenIn.chainId];

    if (!routerAddress) {
      console.log('PancakeSwap is not deployed on this network.');
      return;
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

    console.log(`PancakeSwap Quote: ${amountOut} ${tokenOut.symbol}`);
  } catch (error) {
    console.error('Error getting PancakeSwap quote:', error);
  }
}
