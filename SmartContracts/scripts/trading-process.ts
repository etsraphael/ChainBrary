import { CurrencyAmount, Token, TradeType } from '@uniswap/sdk-core';
import { Pool, Route, Trade } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import { routerContracts } from './constants';
import { DEX, QuotePayload, TradingPayload } from './interfaces';
import { getUniswapV3Quote } from './quote-uniswap';
import { getQuote } from './quote-request';
import inquirer from 'inquirer';

export async function startTrading(payload: TradingPayload): Promise<string | null> {
  try {
    // Check if the quote results are still valid
    const isTradeAccepted: boolean = await checkProfitChecking(payload);
    if (!isTradeAccepted) {
      console.log('The trade has been cancelled');
      return null;
    }

    // Execute the trade if the user confirms
    await executeTrades(payload);

    return null;
  } catch (error) {
    return null;
  }
}

async function checkProfitChecking(payload: TradingPayload): Promise<boolean> {

  // update amount in raw here to 100
  payload.quoteResult1.amountInRaw = '100';
  payload.quoteResult2.amountInRaw = '100';
  payload.quoteResult1.fee = 100;
  payload.quoteResult2.fee = 100;

  const quote1: string | null = await getQuote(payload.quoteResult1); // v3 won't work here
  const quote2: string | null = await getQuote(payload.quoteResult2); // alaways return null
  console.log('quote1', quote1);
  console.log('quote2', quote2);

  if (quote1 === null || quote2 === null) {
    console.log('The quotes are no longer valid.');
    return false;
  }

  const profit: number = ((Number(quote2) - Number(quote1)) / Number(quote1)) * 100;
  console.log(`Old Profit: ${payload.profit.toFixed(2)}%`);
  console.log(`New Profit: ${profit.toFixed(2)}%`);

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Do you want to execute the trade? The latest profit calculated is ${profit.toFixed(2)}%`,
      default: false
    }
  ]);

  return confirm;
}

async function executeTrades(payload: TradingPayload) {
  try {
    // Execute the first trade based on the DEX
    switch (payload.quoteResult1.dex) {
      case DEX.SUSHISWAP_V2:
      case DEX.PANCAKESWAP_V2:
        const isTrade1V2Successful = await executeUniswapV2Trade(payload.quoteResult1);
        if (isTrade1V2Successful) {
          console.log('First trade (V2) executed successfully');
        } else {
          console.log('First trade (V2) execution failed');
          return;
        }
        break;

      case DEX.UNISWAP_V3:
      case DEX.PANCAKESWAP_V3:
        const isTrade1V3Successful = await executeUniswapV3Trade(payload.quoteResult1);
        if (isTrade1V3Successful) {
          console.log('First trade (V3) executed successfully');
        } else {
          console.log('First trade (V3) execution failed');
          return;
        }
        break;

      default:
        console.log(`Unsupported DEX for the first trade: ${payload.quoteResult1.dex}`);
        return;
    }

    // Execute the second trade based on the DEX
    switch (payload.quoteResult2.dex) {
      case DEX.SUSHISWAP_V2:
      case DEX.PANCAKESWAP_V2:
        const isTrade2V2Successful: boolean = await executeUniswapV2Trade(payload.quoteResult2);
        if (isTrade2V2Successful) {
          console.log('Second trade (V2) executed successfully');
        } else {
          console.log('Second trade (V2) execution failed');
          return;
        }
        break;

      case DEX.UNISWAP_V3:
      case DEX.PANCAKESWAP_V3:
        const isTrade2V3Successful: boolean = await executeUniswapV3Trade(payload.quoteResult2);
        if (isTrade2V3Successful) {
          console.log('Second trade (V3) executed successfully');
        } else {
          console.log('Second trade (V3) execution failed');
          return;
        }
        break;

      default:
        console.log(`Unsupported DEX for the second trade: ${payload.quoteResult2.dex}`);
        return;
    }
  } catch (error) {
    console.error('Error executing trades:', error);
  }
}

// Function to execute Uniswap V2 trade
async function executeUniswapV2Trade(payload: QuotePayload): Promise<boolean> {
  try {
    const { tokenIn, tokenOut, networkUrl, amountInRaw, dex } = payload;

    // Get the router address based on DEX and chainId
    const routerAddresses = routerContracts(dex);
    if (!routerAddresses) {
      return false;
    }
    const routerAddress = routerAddresses[tokenIn.chainId];
    if (!routerAddress) {
      return false;
    }

    // Connect to the network
    const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(networkUrl);
    const wallet: ethers.Wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

    // Router ABI for swapExactTokensForTokens
    const ROUTER_ABI: string[] = [
      'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] memory path, address to, uint256 deadline) external returns (uint256[] memory amounts)'
    ];

    const routerContract: ethers.Contract = new ethers.Contract(routerAddress, ROUTER_ABI, wallet);

    // Amount of tokenIn to swap
    const amountIn: bigint = ethers.parseUnits(amountInRaw, tokenIn.decimals);
    const path: string[] = [tokenIn.address, tokenOut.address];

    // Set slippage tolerance (example: 0.5%)
    const amountOutMin = ethers.parseUnits('0.95', tokenOut.decimals);

    // Transaction deadline (example: 20 minutes from now)
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    // Execute the swap
    const tx = await routerContract.swapExactTokensForTokens(amountIn, amountOutMin, path, wallet.address, deadline);

    await tx.wait();
    console.log('Uniswap V2 Trade Executed');
    return true;
  } catch (error) {
    console.error('Error executing Uniswap V2 trade:', error);
    return false;
  }
}

// Function to execute Uniswap V3 trade
async function executeUniswapV3Trade(payload: QuotePayload): Promise<boolean> {
  try {
    const { tokenIn, tokenOut, networkUrl, amountInRaw, fee, dex } = payload;

    // Get the factory address based on DEX and chainId
    const factoryAddresses = routerContracts(dex);
    if (!factoryAddresses) {
      return false;
    }
    const FACTORY_ADDRESS: string = factoryAddresses[tokenIn.chainId];
    if (!FACTORY_ADDRESS) {
      return false;
    }

    // Connect to the network
    const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(networkUrl);
    const wallet: ethers.Wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

    // Get the pool address
    const FACTORY_ABI: string[] = [
      'function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)'
    ];
    const factoryContract: ethers.Contract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
    const poolAddress: string = await factoryContract.getPool(tokenIn.address, tokenOut.address, fee);

    console.log('poolAddress', poolAddress);

    if (poolAddress === ethers.ZeroAddress) {
      return false;
    }

    // Pool ABI for executing the trade
    const POOL_ABI: string[] = [
      'function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external returns (uint256 amountOut)'
    ];

    const poolContract: ethers.Contract = new ethers.Contract(poolAddress, POOL_ABI, wallet);

    // Amount of tokenIn to swap
    const amountIn: bigint = ethers.parseUnits(amountInRaw, tokenIn.decimals);

    // Set slippage tolerance (example: 0.5%)
    const amountOutMin = ethers.parseUnits('0.95', tokenOut.decimals);

    // Transaction deadline (example: 20 minutes from now)
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    // Execute the trade
    const tx = await poolContract.exactInputSingle({
      tokenIn: tokenIn.address,
      tokenOut: tokenOut.address,
      fee: fee,
      recipient: wallet.address,
      deadline: deadline,
      amountIn: amountIn,
      amountOutMinimum: amountOutMin,
      sqrtPriceLimitX96: 0
    });

    await tx.wait();
    console.log('Uniswap V3 Trade Executed');
    return true;
  } catch (error) {
    console.error('Error executing Uniswap V3 trade:', error);
    return false;
  }
}
