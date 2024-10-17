import { CurrencyAmount, Token, TradeType } from '@uniswap/sdk-core';
import { Pool, Route, Trade } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import { NETWORKS, routerContracts } from './constants';
import { INetwork, QuotePayload, QuoteResult } from './interfaces';

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

export async function getUniswapV3Quote(payload: QuotePayload): Promise<QuoteResult | null> {
  try {
    const { tokenIn, tokenOut, networkUrl, amountInRaw, fee, dex } = payload;

    // Ensure tokenIn and tokenOut are instances of Token
    const tokenA = new Token(tokenIn.chainId, tokenIn.address, tokenIn.decimals, tokenIn.symbol, tokenIn.name);
    const tokenB = new Token(tokenOut.chainId, tokenOut.address, tokenOut.decimals, tokenOut.symbol, tokenOut.name);

    // Get the factory address based on DEX and chainId
    const factoryAddresses = routerContracts(dex);
    if (!factoryAddresses) return null;

    const FACTORY_ADDRESS: string = factoryAddresses[tokenA.chainId];
    if (!FACTORY_ADDRESS) return null;

    // Connect to the network
    const provider = new ethers.JsonRpcProvider(networkUrl);

    // Factory ABI
    const FACTORY_ABI = [
      'function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)'
    ];

    // Create factory contract instance
    const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

    // Get pool address
    const poolAddress: string = await factoryContract.getPool(tokenA.address, tokenB.address, fee);

    if (poolAddress === ethers.ZeroAddress) return null;

    // Pool contract ABI
    const POOL_ABI = [
      'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16, uint16, uint16, uint8, bool)',
      'function liquidity() external view returns (uint128)'
    ];

    // Connect to the pool contract
    const poolContract: ethers.Contract = new ethers.Contract(poolAddress, POOL_ABI, provider);

    // Fetch pool state: slot0 and liquidity
    const slot0: bigint[] = await poolContract.slot0();
    const sqrtPriceX96: bigint = slot0[0];
    const tick: bigint = slot0[1];
    const liquidity: bigint = await poolContract.liquidity();

    // Create a Uniswap V3 pool instance
    const pool: Pool = new Pool(tokenA, tokenB, fee, sqrtPriceX96.toString(), liquidity.toString(), Number(tick));

    // Amount of tokenIn to swap
    const amountIn = CurrencyAmount.fromRawAmount(tokenA, ethers.parseUnits(amountInRaw, tokenA.decimals).toString());

    // Create the route and trade (exact input trade)
    const route: Route<Token, Token> = new Route([pool], tokenA, tokenB);
    const trade: Trade<Token, Token, TradeType.EXACT_INPUT> = Trade.createUncheckedTrade({
      route: route,
      inputAmount: amountIn,
      outputAmount: route.midPrice.quote(amountIn),
      tradeType: TradeType.EXACT_INPUT
    });

    // Get the quote for the trade (output amount)
    const tradeAmount: bigint = BigInt(ethers.parseUnits(amountInRaw, tokenA.decimals).toString());

    // Check if the liquidity is enough for the trade amount
    if (tradeAmount > liquidity) {
      return null
    }

    return {
      amountIn: amountIn.toSignificant(6),
      amountOut: trade.outputAmount.toSignificant(6),
      tokenIn: tokenA,
      tokenOut: tokenB,
      network: getNetworkFromChainId(tokenA.chainId),
      dex: dex,
      fee: fee,
      type: 'BUY'
    };
  } catch (error) {
    console.log('error', error);
    return null;
  }
}

function getNetworkFromChainId(chainId: number): INetwork {
  const network: INetwork | undefined = NETWORKS.find((network: INetwork) => network.chainId === chainId);
  if (!network) {
    throw new Error('Network not supported');
  }
  return network;
}
