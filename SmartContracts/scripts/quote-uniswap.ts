import { CurrencyAmount, Token, TradeType } from '@uniswap/sdk-core';
import { Pool, Route, Trade } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';

// Function to get Uniswap quote
export async function getUniswapQuote(
  tokenIn: Token,
  tokenOut: Token,
  networkUrl: string,
  amountInRaw: string, // Amount to swap as a string
  fee: number = 3000 // Pool fee tier (default to 0.3%)
): Promise<void> {
  try {
    // Connect to the network
    const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(networkUrl);

    // Uniswap V3 Factory addresses per network
    const FACTORY_ADDRESSES: { [chainId: number]: string } = {
      1: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Ethereum Mainnet
      137: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Polygon Mainnet
      56: '0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7', // BSC Mainnet
      10: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Optimism Mainnet
      42161: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Arbitrum Mainnet
      42220: '0xAfE208a311B21f13EF87E33A90049fC17A7acDEc' // Celo Mainnet
    };

    // Get the correct factory address for the network
    const FACTORY_ADDRESS: string = FACTORY_ADDRESSES[tokenIn.chainId];

    if (!FACTORY_ADDRESS) {
      console.log('Uniswap V3 is not deployed on this network.');
      return;
    }

    // Factory ABI
    const FACTORY_ABI: string[] = [
      'function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)'
    ];

    // Create factory contract instance
    const factoryContract: ethers.Contract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

    // Get pool address
    const poolAddress: string = await factoryContract.getPool(tokenIn.address, tokenOut.address, fee);

    if (poolAddress === ethers.ZeroAddress) {
      console.log('No pool found for the given token pair and fee tier.');
      return;
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
    const amountOut: string = trade.outputAmount.toSignificant(6);
    console.log(`Uniswap Quote: ${amountOut} ${tokenOut.symbol}`);
  } catch (error) {
    console.error('Error getting Uniswap quote:', error);
  }
}
