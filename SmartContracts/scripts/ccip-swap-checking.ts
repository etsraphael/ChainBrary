import { CurrencyAmount, Token, TradeType } from '@uniswap/sdk-core';
import { Pool, Route, Trade } from '@uniswap/v3-sdk';
import dotenv from 'dotenv';
import { ethers } from 'ethers';

dotenv.config();

// Token details for USDC and DAI on Arbitrum
const USDC = new Token(42161, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USD Coin');
const DAI = new Token(42161, '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18, 'DAI', 'Dai Stablecoin');

// Amount of USDC to swap
const amountIn: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(USDC, ethers.parseUnits('100', 6).toString());

// Pool contract ABI
const POOL_ABI = [
  'function slot0() external view returns (uint160, int24, uint16, uint16, uint16, uint8, bool)',
  'function liquidity() external view returns (uint128)',
];

async function getUniswapQuote(): Promise<void> {
  try {
    // Connect to the Poly Network mainnet
    const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(process.env.POLY_MAINNET_URL);

    // Pool address for USDC/DAI on Arbitrum (3000 fee tier)
    const poolAddress = '0x5f69C2ec01c22843f8273838d570243fd1963014';

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