import { CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core';
import { FeeAmount, Pool, Route, SwapOptions, SwapRouter, Trade } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import inquirer from 'inquirer';
import JSBI from 'jsbi';
import { routerContracts } from './constants';
import { DEX, QuotePayload, TradingPayload } from './interfaces';
import { getQuote } from './quote-request';

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
  // update amount in raw here to 1
  payload.quoteResult1.amountInRaw = '10';
  payload.quoteResult2.amountInRaw = '10';
  payload.quoteResult1.fee = 100;
  payload.quoteResult2.fee = 100;

  const quote1: string | null = await getQuote(payload.quoteResult1);
  const quote2: string | null = await getQuote(payload.quoteResult2);

  // explain the profit
  console.log(
    'First trade: ' +
      quote2 +
      ' ' +
      payload.quoteResult2.tokenOut.symbol +
      ' to ' +
      payload.quoteResult2.amountInRaw +
      ' ' +
      payload.quoteResult2.tokenIn.symbol +
      ' from ' +
      payload.quoteResult2.dex
  );

  console.log(
    'Second trade: ' +
      quote1 +
      ' ' +
      payload.quoteResult1.tokenOut.symbol +
      ' to ' +
      payload.quoteResult1.amountInRaw +
      ' ' +
      payload.quoteResult1.tokenIn.symbol +
      ' from ' +
      payload.quoteResult1.dex
  );

  if (quote1 === null || quote2 === null) {
    console.log('The quotes are no longer valid.');
    return false;
  }

  const profit: number = ((Number(quote1) - Number(quote2)) / Number(quote2)) * 100;
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
  console.log('executeTrades', payload);

  return;
  try {
    // Buy the cheaper token first
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

    // // Sell the more expensive token next
    // switch (payload.quoteResult1.dex) {
    //   case DEX.SUSHISWAP_V2:
    //   case DEX.PANCAKESWAP_V2:
    //     const isTrade1V2Successful = await executeUniswapV2Trade(payload.quoteResult1);
    //     if (isTrade1V2Successful) {
    //       console.log('First trade (V2) executed successfully');
    //     } else {
    //       console.log('First trade (V2) execution failed');
    //       return;
    //     }
    //     break;

    //   case DEX.UNISWAP_V3:
    //   case DEX.PANCAKESWAP_V3:
    //     const isTrade1V3Successful = await executeUniswapV3Trade(payload.quoteResult1);
    //     if (isTrade1V3Successful) {
    //       console.log('First trade (V3) executed successfully');
    //     } else {
    //       console.log('First trade (V3) execution failed');
    //       return;
    //     }
    //     break;

    //   default:
    //     console.log(`Unsupported DEX for the first trade: ${payload.quoteResult1.dex}`);
    //     return;
    // }
  } catch (error) {
    console.error('Error executing trades:', error);
  }
}

// Function to execute Uniswap V2 trade
async function executeUniswapV2Trade(payload: QuotePayload): Promise<boolean> {
  console.log('payload', payload);
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
      'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] memory path, address to, uint256 deadline) external returns (uint256[] memory amounts)',
      'function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts)'
    ];

    const routerContract: ethers.Contract = new ethers.Contract(routerAddress, ROUTER_ABI, wallet);

    // Token contract ABI
    const TOKEN_ABI: string[] = [
      'function approve(address spender, uint256 amount) public returns (bool)',
      'function balanceOf(address owner) public view returns (uint256)',
      'function allowance(address owner, address spender) public view returns (uint256)'
    ];

    const tokenContract: ethers.Contract = new ethers.Contract(tokenOut.address, TOKEN_ABI, wallet);

    // Amount of tokenIn to swap
    const amountIn: bigint = ethers.parseUnits(amountInRaw, tokenOut.decimals);

    // Check balance
    const balance: bigint = await tokenContract.balanceOf(wallet.address);

    // logs the amount by ether
    console.log('amountIn', ethers.formatEther(amountIn.toString()));
    console.log('balance', ethers.formatEther(balance.toString()));

    if (balance < amountIn) {
      console.error('Insufficient token balance');
      return false;
    }

    // Fetch the current gas price from fee data (in Wei)
    const feeData: ethers.FeeData = await provider.getFeeData();
    const currentGasPrice: bigint | null = feeData.gasPrice; // Gas price in Wei

    // Ensure gasPrice exists in the feeData
    if (!currentGasPrice) {
      throw new Error('Could not fetch gas price');
    }

    // logs the gas price in ether
    console.log('currentGasPrice: ', ethers.formatEther(currentGasPrice.toString()));

    // Check allowance
    const allowance: bigint = await tokenContract.allowance(wallet.address, routerAddress);
    const adjustedGasPrice: bigint = (currentGasPrice * 110n) / 100n; // Multiply by 110% (use `n` to indicate `bigint`)

    console.log('allowance', ethers.formatEther(allowance.toString()));

    return true; // stop here for now

    if (allowance < amountIn) {
      console.log('Not enough allowance. Approving...');
      // Adjust the gas price (e.g., increase by 10% to prioritize)

      const approvalTx = await tokenContract.approve(routerAddress, amountIn, {
        gasPrice: adjustedGasPrice
      });

      await approvalTx.wait();
      console.log(`Approved ${tokenOut.symbol} for ${amountInRaw}`);
    }

    if (allowance >= amountIn) {
      console.log('Already enough allowance');
    }

    // Set up the swap
    const path: string[] = [tokenOut.address, tokenIn.address];
    const amountOutMin = ethers.parseUnits('0.95', tokenOut.decimals); // Slippage tolerance: 5%
    const deadline = Math.floor(Date.now() / 1000) + 60 * 2; // 2 minutes from now

    // Get expected amounts out
    const amountsOut = await routerContract.getAmountsOut(amountIn, path);
    const expectedAmountOut = amountsOut[amountsOut.length - 1];
    console.log('Expected amount out:', ethers.formatUnits(expectedAmountOut, tokenIn.decimals));

    // Execute the swap
    // const tx = await routerContract.swapExactTokensForTokens(amountIn, amountOutMin, path, wallet.address, deadline); // this one does not work
    // await tx.wait();

    console.log('Uniswap V2 Trade Executed');
    return true;
  } catch (error) {
    console.error('Error executing Uniswap V2 trade:', error);
    return false;
  }
}

// Function to execute Uniswap V3 trade
async function executeUniswapV3Trade(payload: QuotePayload): Promise<boolean> {
  const MAX_FEE_PER_GAS = ethers.parseUnits('100', 'gwei');
  const MAX_PRIORITY_FEE_PER_GAS = ethers.parseUnits('10', 'gwei');

  const CurrentConfig = {
    wallet: {
      address: process.env.WALLET_PUBLIC_ADDRESS as string,
      privateKey: process.env.WALLET_PRIVATE_KEY as string
    },
    tokens: {
      in: payload.tokenIn,
      amountIn: payload.amountInRaw, // Use the actual input amount
      out: payload.tokenOut,
      poolFee: FeeAmount.MEDIUM
    }
  };

  try {
    const { tokenIn, tokenOut, networkUrl, amountInRaw, fee } = payload;

    // Get the factory address based on DEX and chainId
    const factoryAddresses = routerContracts(DEX.UNISWAP_V3);
    if (!factoryAddresses) {
      console.error('Factory address not found for this DEX.');
      return false;
    }
    const FACTORY_ADDRESS: string = factoryAddresses[tokenIn.chainId];
    if (!FACTORY_ADDRESS) {
      console.error('Factory address not available for this chain.');
      return false;
    }

    // Connect to the network
    const provider = new ethers.JsonRpcProvider(networkUrl);
    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

    // Get the pool details from the contract (you will need on-chain data for this)
    const FACTORY_ABI = [
      'function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)'
    ];
    const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
    const poolAddress = await factoryContract.getPool(tokenIn.address, tokenOut.address, fee);

    if (poolAddress === ethers.ZeroAddress) {
      console.error('No pool found for the given tokens and fee.');
      return false;
    }

    // Pool contract ABI
    const POOL_ABI: string[] = [
      'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16, uint16, uint16, uint8, bool)',
      'function liquidity() external view returns (uint128)'
    ];

    // Connect to the pool contract
    const poolContract: ethers.Contract = new ethers.Contract(poolAddress, POOL_ABI, provider);

    // Fetch pool details: sqrtPriceX96, liquidity, tick (these should be fetched from on-chain data)
    const slot0 = await poolContract.slot0();
    const sqrtPriceX96 = slot0[0];
    const tick = slot0[1];
    const liquidity = await poolContract.liquidity();

    // Create the pool instance using the fetched pool data
    const pool: Pool = new Pool(tokenIn, tokenOut, fee, sqrtPriceX96.toString(), liquidity.toString(), Number(tick));

    // Amount of tokenIn to swap
    const amountIn: JSBI = JSBI.BigInt(amountInRaw); // You can also use ethers.parseUnits(amountInRaw, tokenIn.decimals)

    // Create a trade object using the pool
    const uncheckedTrade: Trade<Token, Token, TradeType.EXACT_INPUT> = Trade.createUncheckedTrade({
      route: new Route([pool], tokenIn, tokenOut),
      inputAmount: CurrencyAmount.fromRawAmount(tokenIn, amountIn),
      outputAmount: CurrencyAmount.fromRawAmount(tokenOut, JSBI.BigInt('0')), // Placeholder
      tradeType: TradeType.EXACT_INPUT
    });

    // Define swap options
    const options: SwapOptions = {
      slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
      deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from now
      recipient: wallet.address
    };

    // Get the method parameters for the swap
    const methodParameters = SwapRouter.swapCallParameters([uncheckedTrade], options);

    // Create the transaction
    const tx: ethers.TransactionRequest = {
      data: methodParameters.calldata,
      to: poolAddress, // Uniswap V3 Router Address (mainnet example)
      value: methodParameters.value,
      from: CurrentConfig.wallet.address,
      maxFeePerGas: MAX_FEE_PER_GAS,
      maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS
    };

    // Send the transaction
    const txResponse = await wallet.sendTransaction(tx);
    await txResponse.wait();

    console.log('Uniswap V3 Trade Executed');
    return true;
  } catch (error) {
    console.error('Error executing Uniswap V3 trade:', error);
    return false;
  }
}
