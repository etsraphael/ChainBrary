import { CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core';
import { Pool, Route, SwapRouter, Trade } from '@uniswap/v3-sdk';
import BigNumber from 'bignumber.js';
import { ethers, TransactionRequest } from 'ethers';

// Function to get Uniswap quote
export async function getUniswapQuote(
  tokenIn: Token,
  tokenOut: Token,
  networkUrl: string,
  amountInRaw: string, // Amount to swap as a string
  fee: number = 3000 // Pool fee tier (default to 0.3%)
): Promise<string | null> {
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
      return null;
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
    const slot0: BigInt[] = await poolContract.slot0();
    const sqrtPriceX96: BigInt = slot0[0];
    const tick: BigInt = slot0[1];
    const liquidity: BigInt = await poolContract.liquidity();

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
    return amountOut;
  } catch (error) {
    console.error('Error getting Uniswap quote:', error);
    return null;
  }
}

export async function checkIfTransactionIsProfitable() {
  // TODO: Check if a transaction is profitable on Uniswap V3
}

async function triggerUniswapTransaction() {
  // TODO: Trigger a transaction on Uniswap V3
}

async function currentCostOfTransaction() {
  // TODO: Calculate the cost of a transaction on Uniswap V3
}

async function sendUniswapTransaction(
  tokenIn: Token,
  tokenOut: Token,
  networkUrl: string,
  amountInRaw: string, // Amount to swap as a string
  fee: number = 3000, // Pool fee tier (default to 0.3%)
  privateKey: string // Private key of the user's wallet
): Promise<string | null> {
  try {
    // Connect to the network
    const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(networkUrl);
    const wallet: ethers.Wallet = new ethers.Wallet(privateKey, provider);

    // Uniswap V3 Factory and Swap Router addresses per network
    const FACTORY_ADDRESSES: { [chainId: number]: string } = {
      1: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Ethereum Mainnet
      137: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Polygon Mainnet
      42161: '0x1F98431c8aD98523631AE4a59f267346ea31F984' // Arbitrum Mainnet
      // Add other networks as needed
    };

    const SWAP_ROUTER_ADDRESSES: { [chainId: number]: string } = {
      1: '0xE592427A0AEce92De3Edee1F18E0157C05861564', // Ethereum Mainnet
      137: '0xE592427A0AEce92De3Edee1F18E0157C05861564', // Polygon Mainnet
      42161: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45' // Arbitrum Mainnet
      // Add other networks as needed
    };

    // Get the correct factory and router addresses for the network
    const FACTORY_ADDRESS = FACTORY_ADDRESSES[tokenIn.chainId];
    const SWAP_ROUTER_ADDRESS = SWAP_ROUTER_ADDRESSES[tokenIn.chainId];

    if (!FACTORY_ADDRESS || !SWAP_ROUTER_ADDRESS) {
      console.log('Uniswap V3 is not deployed on this network.');
      return null;
    }

    // Factory ABI
    const FACTORY_ABI = [
      'function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)'
    ];

    // Create factory contract instance
    const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

    // Get pool address
    const poolAddress = await factoryContract.getPool(tokenIn.address, tokenOut.address, fee);

    if (poolAddress === ethers.ZeroAddress) {
      console.log('No pool found for the given token pair and fee tier.');
      return null;
    }

    // Pool contract ABI
    const POOL_ABI = [
      'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16, uint16, uint16, uint8, bool)',
      'function liquidity() external view returns (uint128)'
    ];

    // Connect to the pool contract
    const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);

    // Fetch pool state: slot0 and liquidity
    const slot0 = await poolContract.slot0();
    const sqrtPriceX96 = slot0[0];
    const tick = slot0[1];
    const liquidity = await poolContract.liquidity();

    // Create a Uniswap V3 pool instance
    const pool = new Pool(tokenIn, tokenOut, fee, sqrtPriceX96.toString(), liquidity.toString(), Number(tick));

    // Amount of tokenIn to swap
    const amountIn = CurrencyAmount.fromRawAmount(tokenIn, ethers.parseUnits(amountInRaw, tokenIn.decimals).toString());

    // Create the route and trade (exact input trade)
    const route = new Route([pool], tokenIn, tokenOut);
    const trade = Trade.createUncheckedTrade({
      route: route,
      inputAmount: amountIn,
      outputAmount: route.midPrice.quote(amountIn),
      tradeType: TradeType.EXACT_INPUT
    });

    // Define swap options
    const slippageTolerance = new Percent(50, 10_000); // 0.5%
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

    const swapOptions = {
      slippageTolerance: slippageTolerance,
      recipient: wallet.address,
      deadline: deadline
    };

    // Generate the swap call parameters
    const methodParameters = SwapRouter.swapCallParameters([trade], swapOptions);

    // Approve the tokenIn if necessary
    const ERC20_ABI = [
      'function allowance(address owner, address spender) external view returns (uint256)',
      'function approve(address spender, uint256 amount) external returns (bool)'
    ];

    const tokenInContract = new ethers.Contract(tokenIn.address, ERC20_ABI, wallet);

    const allowance = await tokenInContract.allowance(wallet.address, SWAP_ROUTER_ADDRESS);

    if (allowance < amountIn.quotient) {
      console.log('Approving token...');
      const approveTx = await tokenInContract.approve(SWAP_ROUTER_ADDRESS, ethers.MaxUint256);
      await approveTx.wait();
      console.log('Token approved.');
    }

    // Build the transaction
    const tx: TransactionRequest = {
      data: methodParameters.calldata,
      to: SWAP_ROUTER_ADDRESS,
      value: methodParameters.value,
      from: wallet.address
      // gasLimit: ethers.utils.parseUnits('1000000', 'wei'), // Optionally set a fixed gas limit
    };

    // Estimate gas limit
    tx.gasLimit = await provider.estimateGas(tx);

    // Get current gas price
    const gasPrice = await provider.estimateGas(tx);
    tx.gasPrice = gasPrice;

    // Send the transaction
    console.log('Sending swap transaction...');
    const swapTx = await wallet.sendTransaction(tx);
    console.log('Transaction sent:', swapTx.hash);

    // Wait for confirmation
    await swapTx.wait();
    console.log('Transaction confirmed:', swapTx.hash);

    return swapTx.hash;
  } catch (error) {
    console.error('Error sending Uniswap transaction:', error);
    return null;
  }
}
