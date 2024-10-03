import { Token, CurrencyAmount, TradeType } from '@uniswap/sdk-core';
import { Pool, Route, Trade } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';

// Token details for USDC and DAI on Arbitrum
const USDC = new Token(42161, '0xFF970A61A04b1CA14834A43f5de4533ebDDB5CC8', 6, 'USDC', 'USD Coin');
const DAI = new Token(42161, '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', 18, 'DAI', 'Dai Stablecoin');

// Amount of USDC to swap
const amountIn: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(USDC, ethers.parseUnits('100', 6).toString());

// Pool contract ABI
const POOL_ABI = [
  'function slot0() external view returns (uint160, int24, uint16, uint16, uint16, uint8, bool)',
  'function liquidity() external view returns (uint128)',
];

async function getUniswapQuote(): Promise<void> {
  try {
    const provider = ethers.getDefaultProvider('arbitrum'); // Connect to Arbitrum network

    // Pool address for USDC/DAI on Arbitrum (3000 fee tier)
    const poolAddress = '0x854046b4C2062B09f3D365F074C8bd51A79Af3de';

    // Connect to the pool contract
    const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);

    // Fetch pool state: slot0 and liquidity
    const [sqrtPriceX96] = await poolContract.slot0();
    const liquidity = await poolContract.liquidity();

    // Create a Uniswap V3 pool instance
    const pool = new Pool(
      USDC,
      DAI,
      3000,
      sqrtPriceX96.toString(),
      liquidity.toString(),
      0
    );

    // Create the route and trade (exact input trade)
    const route = new Route([pool], USDC, DAI);
    const trade = Trade.createUncheckedTrade({
      route: route,
      inputAmount: amountIn,
      outputAmount: route.midPrice.quote(amountIn),
      tradeType: TradeType.EXACT_INPUT,
    });

    // Get the quote for the trade (output amount in DAI)
    const amountOut = trade.outputAmount.toSignificant(6);
    console.log(`Quote: ${amountOut} DAI`);
  } catch (error) {
    console.error('Error getting Uniswap quote:', error);
  }
}

getUniswapQuote();