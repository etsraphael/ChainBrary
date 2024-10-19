// trading-process.ts is used to execute trades based on the quotes generated in pool-listing.ts.
import { CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core';
import { MethodParameters, Pool, Route, SwapOptions, SwapRouter, Trade } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import inquirer from 'inquirer';
import { routerContracts } from './constants';
import { DEX, QuotePayload, QuoteResult, TradingPayload } from './interfaces';
import { getQuote } from './quote-request';

export async function startTrading(payload: TradingPayload): Promise<string | null> {
  try {
    const provider = new ethers.JsonRpcProvider(payload.quoteResult1.network.rpcUrl);
    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

    // Check user balance for ERC20 token
    const userTokenBalance: bigint = await getUserBalance(provider, wallet.address, payload.quoteResult1.tokenIn);
    const requiredTokenAmount: bigint = ethers.parseUnits(
      payload.quoteResult1.amountIn,
      payload.quoteResult1.tokenIn.decimals
    );

    if (userTokenBalance < requiredTokenAmount) {
      console.error('Insufficient ERC20 token balance to execute the trade.');
      return null;
    }

    // Check user balance for native token (for gas fees)
    const userNativeBalance: bigint = await getNativeBalance(provider, wallet.address);
    const estimatedGasFees = await estimateGasFees(payload.quoteResult1); // Assuming this function returns gas fees in native token
    const requiredNativeAmount: bigint = estimatedGasFees.gasLimit * estimatedGasFees.gasPrice;

    if (userNativeBalance < requiredNativeAmount) {
      console.error('Insufficient native token balance to cover gas fees.');
      return null;
    }

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

async function getNativeBalance(provider: ethers.JsonRpcProvider, walletAddress: string): Promise<bigint> {
  const balance: bigint = await provider.getBalance(walletAddress);
  return balance;
}

async function getUserBalance(provider: ethers.JsonRpcProvider, walletAddress: string, token: Token): Promise<bigint> {
  const tokenContract = new ethers.Contract(
    token.address,
    ['function balanceOf(address owner) view returns (uint256)'],
    provider
  );
  const balance: bigint = await tokenContract.balanceOf(walletAddress);
  return balance;
}

async function getPoolData(
  amountInRaw: string,
  tokenIn: Token,
  tokenOut: Token,
  fee: number,
  provider: ethers.JsonRpcProvider,
  dex: DEX
): Promise<{ pool: Pool } | null> {
  try {
    // Ensure tokenIn and tokenOut are instances of Token
    const tokenA = new Token(tokenIn.chainId, tokenIn.address, tokenIn.decimals, tokenIn.symbol, tokenIn.name);
    const tokenB = new Token(tokenOut.chainId, tokenOut.address, tokenOut.decimals, tokenOut.symbol, tokenOut.name);

    // Get the factory address based on DEX and chainId
    const factoryAddresses = routerContracts(dex);
    if (!factoryAddresses) return null;

    const FACTORY_ADDRESS: string = factoryAddresses[tokenA.chainId];
    if (!FACTORY_ADDRESS) return null;

    // Factory ABI
    const FACTORY_ABI = [
      'function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)'
    ];

    // Create factory contract instance
    const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

    // Get pool address
    const poolAddress: string = await factoryContract.getPool(tokenA.address, tokenB.address, fee);

    if (poolAddress === ethers.ZeroAddress) {
      console.error('No pool found for the given tokens and fee.');
      return null;
    }

    // Pool contract ABI
    const POOL_ABI: string[] = [
      'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16, uint16, uint16, uint8, bool)',
      'function liquidity() external view returns (uint128)'
    ];

    // Connect to the pool contract
    const poolContract: ethers.Contract = new ethers.Contract(poolAddress, POOL_ABI, provider);

    // Fetch pool details: slot0 and liquidity
    const [slot0, liquidity] = await Promise.all([poolContract.slot0(), poolContract.liquidity()]);

    // Extract sqrtPriceX96 and tick from slot0
    const sqrtPriceX96 = slot0.sqrtPriceX96 || slot0[0];
    const tick = slot0.tick || slot0[1];

    if (sqrtPriceX96 === undefined || tick === undefined) {
      console.error('Invalid slot0 data');
      return null;
    }
    const pool: Pool = new Pool(tokenA, tokenB, fee, sqrtPriceX96.toString(), liquidity.toString(), Number(tick));

    // console.log('-- Pool Data --');
    // console.log({
    //   tokenA: tokenA.name,
    //   tokenB: tokenB.name,
    //   fee,
    //   sqrtPriceX96: sqrtPriceX96.toString(),
    //   liquidity: liquidity.toString(),
    //   poolAddress,
    //   tick: Number(tick)
    // })

    // check liquidity to know if pool is still valid
    const tradeAmount: bigint = BigInt(ethers.parseUnits(amountInRaw, tokenA.decimals).toString());

    // Check if the liquidity is enough for the trade amount
    if (tradeAmount > liquidity) {
      console.error('Insufficient liquidity in the pool.');
      return null;
    }

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
    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

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
    const poolData = await getPoolData(amountIn, tokenIn, tokenOut, fee, provider, dex);
    if (!poolData) {
      console.error('Pool data could not be fetched.');
      return { gasLimit: BigInt(0), gasPrice: BigInt(0), gasCostEth: '0' };
    }
    const { pool } = poolData;

    // Convert amountIn to raw amount
    const amountInRaw = ethers.parseUnits(amountIn, tokenIn.decimals).toString();

    // Amount of tokenIn to swap
    const amountInCurrency = CurrencyAmount.fromRawAmount(tokenIn, amountInRaw);

    // Create a route
    const route = new Route([pool], tokenIn, tokenOut);

    // Calculate the output amount
    const outputAmount = route.midPrice.quote(amountInCurrency);

    // Create a trade object using the route
    const trade = Trade.createUncheckedTrade({
      route: route,
      inputAmount: amountInCurrency,
      outputAmount: outputAmount,
      tradeType: TradeType.EXACT_INPUT
    });

    // Define swap options
    const options: SwapOptions = {
      slippageTolerance: new Percent(50, 10_000), // 0.5%
      deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from now
      recipient: wallet.address
    };

    // Get the method parameters for the swap
    const methodParameters: MethodParameters = SwapRouter.swapCallParameters([trade], options);

    // Log method parameters for debugging
    // console.log('Method Parameters:', methodParameters);

    // Build the transaction
    const tx: ethers.TransactionRequest = {
      data: methodParameters.calldata,
      to: ROUTER_ADDRESS,
      value: 0n, // Set value to zero for ERC20 swaps
      from: wallet.address
    };

    // Estimate gas
    let gasLimit: bigint;
    try {
      console.log('Estimating gas fees...', tx);
      gasLimit = await provider.estimateGas(tx);
    } catch (error) {
      console.error('Gas estimation failed:', error);
      // Set a default gas limit if estimation fails
      gasLimit = ethers.parseUnits('500000', 'wei'); // Adjust as necessary
    }

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
  const totalGasCost: number = parseFloat(gasFees1.gasCostEth) + parseFloat(gasFees2.gasCostEth);
  const startingAmount: number = parseFloat(latestQuote1.amountIn);
  const endingAmount: number = parseFloat(latestQuote2.amountOut);
  const profitAmount: number = endingAmount - startingAmount - totalGasCost;
  const profitPercentage: number = (profitAmount / startingAmount) * 100;

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
    const poolData = await getPoolData(amountIn, tokenIn, tokenOut, fee, provider, dex);
    if (!poolData) {
      console.error('Pool data could not be fetched.');
      return false;
    }
    const { pool } = poolData;

    // Convert amountIn to raw amount
    const amountInRaw = ethers.parseUnits(amountIn, tokenIn.decimals).toString();

    // Amount of tokenIn to swap
    const amountInCurrency = CurrencyAmount.fromRawAmount(tokenIn, amountInRaw);

    // Create a route
    const route = new Route([pool], tokenIn, tokenOut);

    // Calculate the output amount
    const outputAmount = route.midPrice.quote(amountInCurrency);

    // Create a trade object using the route
    const trade = Trade.createUncheckedTrade({
      route: route,
      inputAmount: amountInCurrency,
      outputAmount: outputAmount,
      tradeType: TradeType.EXACT_INPUT
    });

    // Define swap options
    const options: SwapOptions = {
      slippageTolerance: new Percent(50, 10_000), // 0.5%
      deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from now
      recipient: wallet.address
    };

    // Get the method parameters for the swap
    const methodParameters: MethodParameters = SwapRouter.swapCallParameters([trade], options);

    // Log method parameters for debugging
    console.log('Method Parameters:', methodParameters);

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

    if (allowance < BigInt(amountInRaw)) {
      console.log(`Approving ${tokenIn.symbol} for trade...`);

      // Reset allowance to zero if necessary (for USDT)
      const resetApproveTx = await tokenInContract.approve(ROUTER_ADDRESS, 0);
      await resetApproveTx.wait();

      const approveTx = await tokenInContract.approve(ROUTER_ADDRESS, amountInRaw);
      await approveTx.wait();
      console.log('Approval transaction confirmed.');
    }

    // Create the transaction
    const tx: ethers.TransactionRequest = {
      data: methodParameters.calldata,
      to: ROUTER_ADDRESS,
      value: 0n, // Set value to zero explicitly
      // Remove 'from' field
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
