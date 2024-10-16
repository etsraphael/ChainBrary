import { CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core';
import { FeeAmount, MethodParameters, Pool, Route, SwapOptions, SwapRouter, Trade } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import inquirer from 'inquirer';
import JSBI from 'jsbi';
import { routerContracts } from './constants';
import { DEX, QuotePayload, QuoteResult, TradingPayload } from './interfaces';
import { getQuote } from './quote-request';

// Function to get pool data
async function getPoolData(
  tokenIn: Token,
  tokenOut: Token,
  fee: number,
  provider: ethers.JsonRpcProvider,
  dex: DEX
): Promise<{ pool: Pool } | null> {
  try {
    // Get the factory address based on DEX and chainId
    const factoryAddresses = routerContracts(dex);
    if (!factoryAddresses) {
      console.error('Factory address not found for this DEX.');
      return null;
    }
    const FACTORY_ADDRESS: string = factoryAddresses[tokenIn.chainId];
    if (!FACTORY_ADDRESS) {
      console.error('Factory address not available for this chain.');
      return null;
    }

    // Get the pool details from the contract
    const FACTORY_ABI = [
      'function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)'
    ];
    const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
    const poolAddress = await factoryContract.getPool(tokenIn.address, tokenOut.address, fee);

    if (poolAddress === ethers.ZeroAddress) {
      console.error('No pool found for the given tokens and fee.');
      return null;
    }

    // Pool contract ABI
    const POOL_ABI: string[] = [
      'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
      'function liquidity() external view returns (uint128)'
    ];

    // Connect to the pool contract
    const poolContract: ethers.Contract = new ethers.Contract(poolAddress, POOL_ABI, provider);

    // Fetch pool details
    const [slot0, liquidity] = await Promise.all([poolContract.slot0(), poolContract.liquidity()]);
    const sqrtPriceX96: bigint = slot0[0];
    const tick: number = slot0[1];

    // Create the pool instance
    const pool: Pool = new Pool(tokenIn, tokenOut, fee, sqrtPriceX96.toString(), liquidity.toString(), tick);

    return { pool };
  } catch (error) {
    console.error('Error fetching pool data:', error);
    return null;
  }
}

async function estimateGasFees(
  quoteResult: QuoteResult
): Promise<{ gasLimit: bigint; gasPrice: bigint; gasCostEth: string }> {
  try {
    const { tokenIn, tokenOut, network, amountIn, fee, dex } = quoteResult;

    // Connect to the network
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);

    // Get the router address based on DEX and chainId
    const routerAddresses = routerContracts(dex);
    if (!routerAddresses) {
      console.error('Router address not found for this DEX.');
      return { gasLimit: BigInt(0), gasPrice: BigInt(0), gasCostEth: '0' };
    }
    const ROUTER_ADDRESS: string = routerAddresses[tokenIn.chainId];
    if (!ROUTER_ADDRESS) {
      console.error('Router address not available for this chain.');
      return { gasLimit: BigInt(0), gasPrice: BigInt(0), gasCostEth: '0' };
    }

    // Get the pool details
    const poolData = await getPoolData(tokenIn, tokenOut, fee, provider, dex);
    if (!poolData) {
      console.error('Pool data could not be fetched.');
      return { gasLimit: BigInt(0), gasPrice: BigInt(0), gasCostEth: '0' };
    }
    const { pool } = poolData;

    // Amount of tokenIn to swap
    const amountInCurrency = CurrencyAmount.fromRawAmount(tokenIn, amountIn);

    // Create a trade object using the pool
    const trade = await Trade.fromRoute(new Route([pool], tokenIn, tokenOut), amountInCurrency, TradeType.EXACT_INPUT);

    // Define swap options
    const options: SwapOptions = {
      slippageTolerance: new Percent(50, 10_000), // 0.5%
      deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from now
      recipient: process.env.WALLET_PUBLIC_ADDRESS as string
    };

    // Get the method parameters for the swap
    const methodParameters: MethodParameters = SwapRouter.swapCallParameters([trade], options);

    // Build the transaction
    const tx: ethers.TransactionRequest = {
      data: methodParameters.calldata,
      to: ROUTER_ADDRESS,
      value: methodParameters.value,
      from: process.env.WALLET_PUBLIC_ADDRESS as string
    };

    // Estimate gas
    const gasLimit: bigint = await provider.estimateGas(tx);
    const feeData = await provider.getFeeData();
    const gasPrice: bigint = feeData.gasPrice ?? BigInt(0);
    const gasCost = gasLimit * gasPrice;
    const gasCostEth = ethers.formatEther(gasCost);

    return { gasLimit, gasPrice, gasCostEth };
  } catch (error) {
    console.error('Error estimating gas fees:', error);
    return { gasLimit: BigInt(0), gasPrice: BigInt(0), gasCostEth: '0' };
  }
}

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
    console.error('Error in startTrading:', error);
    return null;
  }
}

async function checkProfitChecking(payload: TradingPayload): Promise<boolean> {
  const quoteResult1: QuoteResult = payload.quoteResult1;
  const quoteResult2: QuoteResult = payload.quoteResult2;

  // Get the latest quotes
  const latestQuote1: QuoteResult | null = await getQuote({
    tokenIn: quoteResult1.tokenIn,
    tokenOut: quoteResult1.tokenOut,
    amountInRaw: quoteResult1.amountIn,
    networkUrl: quoteResult1.network.rpcUrl,
    fee: quoteResult1.fee,
    dex: quoteResult1.dex
  });

  const latestQuote2: QuoteResult | null = await getQuote({
    tokenIn: quoteResult2.tokenIn,
    tokenOut: quoteResult2.tokenOut,
    amountInRaw: quoteResult2.amountIn,
    networkUrl: quoteResult2.network.rpcUrl,
    fee: quoteResult2.fee,
    dex: quoteResult2.dex
  });

  if (latestQuote1 === null || latestQuote2 === null) {
    console.log('The quotes are no longer valid.');
    return false;
  }

  // Estimate gas fees for both trades
  const [gasFees1, gasFees2] = await Promise.all([estimateGasFees(latestQuote1), estimateGasFees(latestQuote2)]);

  const totalGasCost = parseFloat(gasFees1.gasCostEth) + parseFloat(gasFees2.gasCostEth);

  const startingAmount = parseFloat(latestQuote1.amountIn);
  const endingAmount = parseFloat(latestQuote2.amountOut);

  const profitAmount = endingAmount - startingAmount - totalGasCost;
  const profitPercentage = (profitAmount / startingAmount) * 100;

  console.log('\nTrade Details:');
  console.log(
    `First trade: Buy ${latestQuote1.tokenOut.symbol} with ${latestQuote1.amountIn} ${latestQuote1.tokenIn.symbol} on ${latestQuote1.dex}`
  );
  console.log(
    `Second trade: Sell ${latestQuote2.amountIn} ${latestQuote2.tokenIn.symbol} for ${latestQuote2.amountOut} ${latestQuote2.tokenOut.symbol} on ${latestQuote2.dex}`
  );
  console.log(`Estimated Gas Fees: ${totalGasCost.toFixed(6)} ${latestQuote1.tokenIn.symbol}`);
  console.log(`Profit before fees: ${(endingAmount - startingAmount).toFixed(6)} ${latestQuote1.tokenIn.symbol}`);
  console.log(`Profit after fees: ${profitAmount.toFixed(6)} ${latestQuote1.tokenIn.symbol}`);
  console.log(`Profit Percentage after fees: ${profitPercentage.toFixed(2)}%\n`);

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Do you want to execute the trade? The latest profit calculated is ${profitPercentage.toFixed(2)}% after fees`,
      default: false
    }
  ]);

  return confirm;
}

async function executeTrades(payload: TradingPayload) {
  console.log('Executing Trades...');

  try {
    // Execute the first trade (buy)
    console.log('Executing first trade...');
    const isTrade1Successful = await executeUniswapV3Trade(payload.quoteResult1);
    if (isTrade1Successful) {
      console.log('First trade executed successfully');
    } else {
      console.log('First trade execution failed');
      return;
    }

    // Execute the second trade (sell)
    console.log('Executing second trade...');
    const isTrade2Successful: boolean = await executeUniswapV3Trade(payload.quoteResult2);
    if (isTrade2Successful) {
      console.log('Second trade executed successfully');
    } else {
      console.log('Second trade execution failed');

      // Backup plan: Attempt to sell the token on the same DEX as the first trade
      console.log('Attempting backup plan to mitigate loss...');

      const backupQuotePayload: QuotePayload = {
        tokenIn: payload.quoteResult2.tokenIn,
        tokenOut: payload.quoteResult2.tokenOut,
        amountInRaw: payload.quoteResult2.amountIn,
        networkUrl: payload.quoteResult2.network.rpcUrl,
        fee: payload.quoteResult2.fee,
        dex: payload.quoteResult1.dex // Use the DEX from the first trade
      };

      const backupQuoteResult: QuoteResult | null = await getQuote(backupQuotePayload);

      if (backupQuoteResult) {
        const isBackupTradeSuccessful = await executeUniswapV3Trade(backupQuoteResult);

        if (isBackupTradeSuccessful) {
          console.log('Backup trade executed successfully');
        } else {
          console.log('Backup trade execution failed. You may need to manually sell the token.');
        }
      } else {
        console.log('Unable to get backup quote. You may need to manually sell the token.');
      }
    }
  } catch (error) {
    console.error('Error executing trades:', error);
  }
}

async function executeUniswapV3Trade(quoteResult: QuoteResult): Promise<boolean> {
  const MAX_FEE_PER_GAS = ethers.parseUnits('100', 'gwei');
  const MAX_PRIORITY_FEE_PER_GAS = ethers.parseUnits('10', 'gwei');

  try {
    const { tokenIn, tokenOut, network, amountIn, fee, dex } = quoteResult;

    // Get the router address based on DEX and chainId
    const routerAddresses = routerContracts(dex);
    if (!routerAddresses) {
      console.error('Router address not found for this DEX.');
      return false;
    }
    const ROUTER_ADDRESS: string = routerAddresses[tokenIn.chainId];
    if (!ROUTER_ADDRESS) {
      console.error('Router address not available for this chain.');
      return false;
    }

    // Connect to the network
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

    // Get the pool data
    const poolData = await getPoolData(tokenIn, tokenOut, fee, provider, dex);
    if (!poolData) {
      console.error('Pool data could not be fetched.');
      return false;
    }
    const { pool } = poolData;

    // Amount of tokenIn to swap
    const amountInCurrency = CurrencyAmount.fromRawAmount(tokenIn, amountIn);

    // Create a trade object using the pool
    const trade = await Trade.fromRoute(new Route([pool], tokenIn, tokenOut), amountInCurrency, TradeType.EXACT_INPUT);

    // Define swap options
    const options: SwapOptions = {
      slippageTolerance: new Percent(50, 10_000), // 0.5%
      deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from now
      recipient: wallet.address
    };

    // Get the method parameters for the swap
    const methodParameters: MethodParameters = SwapRouter.swapCallParameters([trade], options);

    // Check allowance and approve if necessary
    const tokenInContract = new ethers.Contract(
      tokenIn.address,
      [
        'function allowance(address, address) view returns (uint256)',
        'function approve(address spender, uint256 amount) returns (bool)'
      ],
      wallet
    );

    const allowance: bigint = await tokenInContract.allowance(wallet.address, ROUTER_ADDRESS);

    if (allowance < BigInt(amountIn)) {
      console.log(`Approving ${tokenIn.symbol} for trade...`);
      const approveTx = await tokenInContract.approve(ROUTER_ADDRESS, ethers.MaxUint256);
      await approveTx.wait();
      console.log('Approval transaction confirmed.');
    }

    // Create the transaction
    const tx: ethers.TransactionRequest = {
      data: methodParameters.calldata,
      to: ROUTER_ADDRESS,
      value: methodParameters.value,
      from: wallet.address,
      maxFeePerGas: MAX_FEE_PER_GAS,
      maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS
    };

    // Send the transaction
    const txResponse: ethers.TransactionResponse = await wallet.sendTransaction(tx);
    console.log(`Transaction sent: ${txResponse.hash}`);
    await txResponse.wait();
    console.log('Trade executed successfully.');
    return true;
  } catch (error) {
    console.error('Error executing trade:', error);
    return false;
  }
}
