import { Injectable } from '@angular/core';
import Web3, { AbiFragment, Contract } from 'web3';
import { AbiItem } from 'web3-utils';
import {
  PoolContract,
  PoolDetailObjectResponse,
  PoolLiquidityResponse,
  SwapRouterContract,
  SwapRouterObjectResponse
} from '../../contracts';
import { SwapFactoryContract } from '../../contracts/swapFactory';
import { IQuoteResult, IToken, ITokenContract } from '../../interfaces';
import {
  ILiquidityBalanceCheckPayload,
  ILiquidityPayload,
  IPoolDetail,
  IPoolDetailForm,
  IPoolSearch,
  IRemoveLiquidityPayload,
  ISwappingPayload,
  SwapPayload
} from '../../interfaces/swap.interface';
import { TokensService } from '../tokens/tokens.service';
import { Web3ProviderService } from '../web3-provider/web3-provider.service';

@Injectable({
  providedIn: 'root'
})
export class DexService {
  constructor(
    private web3ProviderService: Web3ProviderService,
    private tokensService: TokensService
  ) {}

  private isAmountsOutResponseValid(res: unknown): res is SwapRouterObjectResponse {
    if (typeof res !== 'object' || res === null) {
      return false;
    }

    const obj = res as { [key: string]: unknown };

    return typeof obj[0] === 'bigint' && typeof obj[1] === 'bigint';
  }

  private isPoolLiquidityResponseValid(res: unknown): res is PoolLiquidityResponse {
    if (typeof res !== 'object' || res === null) {
      return false;
    }

    const obj = res as { [key: string]: unknown };

    return typeof obj[0] === 'bigint' && typeof obj[1] === 'bigint' && typeof obj['__length__'] === 'number';
  }

  private isPoolDetailResponseValid(res: unknown): res is IPoolDetail {
    if (typeof res !== 'object' || res === null) {
      return false;
    }

    const obj = res as { [key: string]: unknown };

    return (
      typeof obj[0] === 'string' &&
      typeof obj[1] === 'string' &&
      typeof obj[2] === 'bigint' &&
      typeof obj[3] === 'bigint' &&
      typeof obj[4] === 'bigint' &&
      typeof obj['__length__'] === 'number'
    );
  }

  async getAmountsOut(payload: SwapPayload): Promise<IQuoteResult> {
    const web3: Web3 = new Web3(this.web3ProviderService.getRpcUrl(payload.chainId));
    const swapRouterContract = new SwapRouterContract(payload.chainId);

    const contractFragment: Contract<AbiFragment[]> = new web3.eth.Contract(
      swapRouterContract.getAbi() as AbiItem[],
      swapRouterContract.getAddress()
    );

    const tokenInAddress: string | undefined = payload.from.networkSupport.find(
      (network: ITokenContract) => network.chainId === payload.chainId
    )?.address;
    const tokenOutAddress: string | undefined = payload.to.networkSupport.find(
      (network: ITokenContract) => network.chainId === payload.chainId
    )?.address;

    if (!tokenInAddress || !tokenOutAddress) {
      return Promise.reject('Token not supported on this network');
    }

    return contractFragment.methods['getAmountsOut'](
      web3.utils.toWei(1, 'ether'),
      [tokenInAddress, tokenOutAddress],
      [500]
    )
      .call()
      .then((res: void | [] | SwapRouterObjectResponse) => {
        if (!this.isAmountsOutResponseValid(res)) {
          return Promise.reject('Invalid amounts out response');
        }

        return {
          token0: Number(web3.utils.fromWei(String(res[0]), 'ether')),
          token1: Number(web3.utils.fromWei(String(res[1]), 'ether'))
        };
      })
      .catch((error: string) => {
        return Promise.reject(error);
      });
  }

  async addLiquidity(from: string, payload: ILiquidityPayload): Promise<string> {
    const web3: Web3 = new Web3(window.ethereum);

    const address1: string = payload.token1.networkSupport.find(
      (network: ITokenContract) => network.chainId === payload.chainId
    )?.address as string;
    const address2: string = payload.token2.networkSupport.find(
      (network: ITokenContract) => network.chainId === payload.chainId
    )?.address as string;

    return this.getPool({
      chainId: payload.chainId,
      token1Address: address1,
      token2Address: address2
    })
      .then(async (res: IPoolDetail) => {
        const poolContract: PoolContract = new PoolContract(payload.chainId);
        const poolFragment: Contract<AbiFragment[]> = new web3.eth.Contract(
          poolContract.getAbi() as AbiItem[],
          res.contractAddress
        );

        const amount0 = web3.utils.toWei(payload.token1Amount, 'ether');
        const amount1 = web3.utils.toWei(payload.token2Amount, 'ether');

        const gasEstimate: bigint = await poolFragment.methods['addLiquidity'](amount0, amount1).estimateGas({
          from
        });

        return poolFragment.methods['addLiquidity'](amount0, amount1)
          .send({
            from: from,
            gas: gasEstimate.toString()
          })
          .then((receipt) => receipt.transactionHash);
      })
      .catch((error: string) => {
        return Promise.reject(error);
      });
  }

  async removeLiquidity(from: string, payload: IRemoveLiquidityPayload): Promise<string> {
    const web3: Web3 = new Web3(window.ethereum);
    const poolContract = new PoolContract(payload.chainId);

    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      poolContract.getAbi() as AbiItem[],
      payload.poolAddress
    );

    const gasEstimate: bigint = await contract.methods['removeLiquidity'](
      web3.utils.toWei(payload.liquidity.toString(), 'ether')
    ).estimateGas({
      from
    });

    return contract.methods['removeLiquidity'](web3.utils.toWei(payload.liquidity.toString(), 'ether'))
      .send({
        from: from,
        gas: gasEstimate.toString()
      })
      .then((receipt) => receipt.transactionHash)
      .catch((error: string) => Promise.reject(error));
  }

  async getPool(search: IPoolSearch): Promise<IPoolDetail> {
    const web3: Web3 = new Web3(this.web3ProviderService.getRpcUrl(search.chainId));
    const swapRouterContract = new SwapFactoryContract(search.chainId);

    const swapRouterFragment: Contract<AbiFragment[]> = new web3.eth.Contract(
      swapRouterContract.getAbi() as AbiItem[],
      swapRouterContract.getAddress()
    );

    return swapRouterFragment.methods['getPool'](search.token1Address, search.token2Address, swapRouterContract.fee)
      .call()
      .then(async (res: void | [] | string) => {
        if (web3.utils.isNullish(res) || res === '0x0000000000000000000000000000000000000000')
          return Promise.reject('Pool_not_found');
        else {
          const poolContract = new PoolContract(search.chainId);
          const poolFragment: Contract<AbiFragment[]> = new web3.eth.Contract(
            poolContract.getAbi() as AbiItem[],
            res as string
          );

          const poolDetailResponse: PoolDetailObjectResponse = await poolFragment.methods['getPoolDetails']().call();

          if (!this.isPoolDetailResponseValid(poolDetailResponse)) {
            return Promise.reject('Invalid pool detail response');
          }
          const poolDetail: IPoolDetail = {
            contractAddress: res as string,
            token1Address: poolDetailResponse[0],
            token2Address: poolDetailResponse[1],
            fee: Number(web3.utils.fromWei(String(poolDetailResponse[2]), 'ether')),
            token1Amount: Number(web3.utils.fromWei(String(poolDetailResponse[3]), 'ether')),
            token2Amount: Number(web3.utils.fromWei(String(poolDetailResponse[4]), 'ether')),
            chainId: search.chainId
          };

          return poolDetail;
        }
      })
      .catch((error: string) => Promise.reject(error));
  }

  async createPool(from: string, payload: IPoolSearch): Promise<{ poolDetail: IPoolDetail; transactionHash: string }> {
    const web3: Web3 = new Web3(window.ethereum);
    const swapRouterContract = new SwapFactoryContract(payload.chainId);

    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      swapRouterContract.getAbi() as AbiItem[],
      swapRouterContract.getAddress()
    );

    const gas: bigint = await contract.methods['createPool'](
      payload.token1Address,
      payload.token2Address,
      swapRouterContract.fee
    ).estimateGas({ from });

    return contract.methods['createPool'](payload.token1Address, payload.token2Address, swapRouterContract.fee)
      .send({ from, gas: gas.toString() })
      .then(async (receipt) => {
        const poolDetail = await this.getPool({
          chainId: payload.chainId,
          token1Address: payload.token1Address,
          token2Address: payload.token2Address
        });
        return { poolDetail, transactionHash: receipt.transactionHash };
      })
      .catch((error: string) => Promise.reject(error));
  }

  async swapExactTokensForTokens(payload: ISwappingPayload, from: string): Promise<string> {
    const web3: Web3 = new Web3(window.ethereum);
    const swapRouterContract = new SwapRouterContract(payload.chainId);

    const contractFragment: Contract<AbiFragment[]> = new web3.eth.Contract(
      swapRouterContract.getAbi() as AbiItem[],
      swapRouterContract.getAddress()
    );

    const tokenInAddress: string | undefined = payload.path[0];
    const tokenOutAddress: string | undefined = payload.path[1];

    if (!tokenInAddress || !tokenOutAddress) {
      return Promise.reject('Token not supported on this network');
    }

    // calculate gaz
    const gasEstimate: bigint = await contractFragment.methods['swapExactTokensForTokens'](
      web3.utils.toWei(payload.amount, 'ether'),
      web3.utils.toWei('0.5', 'ether'),
      [tokenInAddress, tokenOutAddress],
      [500],
      from
    )
      .estimateGas({
        from: from
      })
      .catch((error: string) => {
        return Promise.reject(error);
      });

    return contractFragment.methods['swapExactTokensForTokens'](
      web3.utils.toWei(payload.amount, 'ether'),
      web3.utils.toWei('0.5', 'ether'),
      [tokenInAddress, tokenOutAddress],
      [500],
      from
    )
      .send({
        from: from,
        gas: gasEstimate.toString()
      })
      .then((receipt) => receipt.transactionHash)
      .catch((error: string) => Promise.reject(error));
  }

  async preloadLiquidityForm(payload: IPoolSearch): Promise<IPoolDetailForm> {
    const token1: IToken = await this.tokensService.getERC20TokenByAddress(payload.chainId, payload.token1Address);
    const token2: IToken = await this.tokensService.getERC20TokenByAddress(payload.chainId, payload.token2Address);

    // Error message if not found
    if (!token1 || !token2) {
      return Promise.reject('Token not found');
    }

    let res: IPoolDetail | null = null;
    try {
      res = await this.getPool(payload);
    } catch (error) {
      res = null;
    }

    return {
      poolId: res?.contractAddress ?? null,
      token1,
      token2,
      token1Amount: res?.token1Amount ?? 0,
      token2Amount: res?.token2Amount ?? 0,
      chainId: payload.chainId,
      fee: res?.fee ?? 0
    };
  }

  async callLiquidityAmount(payload: ILiquidityBalanceCheckPayload): Promise<number[]> {
    const web3: Web3 = new Web3(this.web3ProviderService.getRpcUrl(payload.chainId));
    const poolContract = new PoolContract(payload.chainId);
    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      poolContract.getAbi() as AbiItem[],
      payload.poolAddress
    );

    return contract.methods['getLiquidityProvided'](payload.from)
      .call()
      .then((liquidity: void | [] | PoolLiquidityResponse) => {
        if (!this.isPoolLiquidityResponseValid(liquidity)) {
          return Promise.reject('Invalid liquidity response');
        }
        return [
          Number(web3.utils.fromWei(String(liquidity[0]), 'ether')),
          Number(web3.utils.fromWei(String(liquidity[1]), 'ether'))
        ];
      })
      .catch((error: string) => Promise.reject(error));
  }
}
