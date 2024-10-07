import { CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core';
import { Pool, Route, SwapRouter, Trade } from '@uniswap/v3-sdk';
import { ethers, TransactionRequest } from 'ethers';
import { DEX, QuotePayload } from './interfaces';

// Function to get Uniswap quote
export async function getQuote(payload: QuotePayload): Promise<string | null> {
  switch (payload.dex) {
    case DEX.UNISWAP_V3:
      return getUniswapV3Quote(payload);
    case DEX.SUSHISWAP_V2:
      return getUniswapV2Quote(payload);
    case DEX.PANCAKESWAP_V2:
      return getUniswapV2Quote(payload);
    default:
      return null;
  }
}

export async function getUniswapV2Quote(payload: QuotePayload): Promise<string | null> {
  try {
    const { tokenIn, tokenOut, networkUrl, amountInRaw, dex } = payload;

    // Get the router address based on DEX and chainId
    const routerAddresses = routerContracts(dex);
    if (!routerAddresses) {
      return null;
    }
    const routerAddress = routerAddresses[tokenIn.chainId];
    if (!routerAddress) {
      return null;
    }

    // Connect to the network
    const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(networkUrl);

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

export async function getUniswapV3Quote(payload: QuotePayload): Promise<string | null> {
  try {
    const { tokenIn, tokenOut, networkUrl, amountInRaw, fee, dex } = payload;

    // Get the factory address based on DEX and chainId
    const factoryAddresses = routerContracts(dex);
    if (!factoryAddresses) {
      return null;
    }
    const FACTORY_ADDRESS = factoryAddresses[tokenIn.chainId];
    if (!FACTORY_ADDRESS) {
      return null;
    }

    // Connect to the network
    const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(networkUrl);

    // Factory ABI
    const FACTORY_ABI: string[] = [
      'function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)'
    ];

    // Create factory contract instance
    const factoryContract: ethers.Contract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

    // Get pool address
    const poolAddress: string = await factoryContract.getPool(tokenIn.address, tokenOut.address, fee);

    if (poolAddress === ethers.ZeroAddress) {
      return null;
    }

    // Pool contract ABI
    const POOL_ABI: string[] = [
      'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16, uint16, uint16, uint8, bool)',
      'function liquidity() external view returns (uint128)'
    ];

    // Connect to the pool contract
    const poolContract: ethers.Contract = new ethers.Contract(poolAddress, POOL_ABI, provider);

    // Fetch pool state: slot0 and liquidity
    const slot0 = await poolContract.slot0();
    const sqrtPriceX96 = slot0[0];
    const tick = slot0[1];
    const liquidity = await poolContract.liquidity();

    // Create a Uniswap V3 pool instance
    const pool: Pool = new Pool(tokenIn, tokenOut, fee, sqrtPriceX96.toString(), liquidity.toString(), Number(tick));

    // Amount of tokenIn to swap
    const amountIn: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(
      tokenIn,
      ethers.parseUnits(amountInRaw, tokenIn.decimals).toString()
    );

    // Create the route and trade (exact input trade)
    const route = new Route([pool], tokenIn, tokenOut);
    const trade = Trade.createUncheckedTrade({
      route: route,
      inputAmount: amountIn,
      outputAmount: route.midPrice.quote(amountIn),
      tradeType: TradeType.EXACT_INPUT
    });

    // Get the quote for the trade (output amount)
    const amountOut = trade.outputAmount.toSignificant(6);
    return amountOut;
  } catch (error) {
    return null;
  }
}

function routerContracts(dex: DEX): { [chainId: number]: string } | null {
  switch (dex) {
    case DEX.UNISWAP_V3:
      return {
        1: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Ethereum Mainnet
        137: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Polygon Mainnet
        56: '0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7', // BSC Mainnet
        10: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Optimism Mainnet
        42161: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Arbitrum Mainnet
        42220: '0xAfE208a311B21f13EF87E33A90049fC17A7acDEc' // Celo Mainnet
      };
    case DEX.SUSHISWAP_V2:
      return {
        1: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F', // Ethereum Mainnet
        137: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506', // Polygon Mainnet
        56: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506', // BSC Mainnet
        42161: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506' // Arbitrum Mainnets
      };
    case DEX.PANCAKESWAP_V2:
      return {
        1: '0xEfF92A263d31888d860bD50809A8D171709b7b1c', // Ethereum Mainnet
        56: '0x10ED43C718714eb63d5aA57B78B54704E256024E', // BSC Mainnet
        42161: '0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb' // Arbitrum Mainnets
      };
    default:
      return null;
  }
}
