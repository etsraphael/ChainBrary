import { CurrencyAmount, Token, TradeType } from '@uniswap/sdk-core';
import { Pool, Route, Trade } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import { routerContracts } from './constants';
import { QuotePayload } from './interfaces';

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

    // console.log('amountIn', amountIn.toString())
    // console.log('routerContract', await routerContract.getAddress());
    // console.log('path', path);

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
    const FACTORY_ADDRESS: string = factoryAddresses[tokenIn.chainId];
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
    const route: Route<Token, Token> = new Route([pool], tokenIn, tokenOut);
    const trade: Trade<Token, Token, TradeType.EXACT_INPUT> = Trade.createUncheckedTrade({
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
