import { Injectable } from '@angular/core';
import Web3, { AbiFragment, Contract } from 'web3';
import { AbiItem } from 'web3-utils';
import { PoolContract, PoolDetailObjectResponse, SwapRouterContract, SwapRouterObjectResponse } from '../../contracts';
import { SwapFactoryContract } from '../../contracts/swapFactory';
import { IQuoteResult, IToken, ITokenContract } from '../../interfaces';
import {
  ILiquidityPayload,
  IPoolDetail,
  IPoolDetailForm,
  IPoolSearch,
  ISwappingPayload,
  SwapPayload
} from '../../interfaces/swap.interface';
import { Web3ProviderService } from '../web3-provider/web3-provider.service';
import { TokensService } from '../tokens/tokens.service';

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
    const web3: Web3 = new Web3(this.web3ProviderService.getRpcUrl(payload.chainId));

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
        const poolFragment: Contract<AbiFragment[]> = new web3.eth.Contract(poolContract.getAbi() as AbiItem[], res.id);

        const amount0 = web3.utils.toWei(payload.token1Amount, 'ether');
        const amount1 = web3.utils.toWei(payload.token1Amount, 'ether');

        const gasEstimate: bigint = await poolFragment.methods['addLiquidity'](amount0, amount1).estimateGas({
          from
        });

        return poolFragment.methods['addLiquidity'](amount0, amount1)
          .send({
            from: from,
            gas: gasEstimate.toString()
          })
          .then((res) => {
            console.log('res', res);
            return 'Liquidity added';
          });
      })
      .catch((error: string) => {
        console.log(error);
        return Promise.reject(error);
      });
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
            id: res as string,
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

  async createPool(from: string, payload: IPoolSearch): Promise<IPoolDetail> {
    const web3: Web3 = new Web3(this.web3ProviderService.getRpcUrl(payload.chainId));
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
      .then(() =>
        this.getPool({
          chainId: payload.chainId,
          token1Address: payload.token1Address,
          token2Address: payload.token2Address
        })
      )
      .catch((error: string) => Promise.reject(error));
  }

  async swapExactTokensForTokens(payload: ISwappingPayload): Promise<string> {
    console.log('swapExactTokensForTokens starting');
    console.log('payload', payload);
    const web3: Web3 = new Web3(this.web3ProviderService.getRpcUrl(payload.chainId));
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

    console.log('gaz estimate starting');

    // calculate gaz
    const gasEstimate: bigint = await contractFragment.methods['swapExactTokensForTokens'](
      web3.utils.toWei(payload.amount, 'ether'),
      web3.utils.toWei('0.5', 'ether'),
      [tokenInAddress, tokenOutAddress],
      [500],
      payload.to
    )
      .estimateGas({
        from: payload.to
      })
      .catch((error: string) => {
        console.log('error', error);
        return Promise.reject(error);
      });

    console.log('gasEstimate', gasEstimate.toString());

    return contractFragment.methods['swapExactTokensForTokens'](
      web3.utils.toWei(payload.amount, 'ether'),
      web3.utils.toWei('0.5', 'ether'),
      [tokenInAddress, tokenOutAddress],
      [500],
      payload.to
    )
      .send({
        from: payload.to,
        gas: gasEstimate.toString()
      })
      .then((res) => {
        console.log('res', res);
        return 'Swap successful';
      })
      .catch((error: string) => {
        console.log('error0', error);

        return Promise.reject(error);
      });
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
      console.log('Error fetching pool details', error);
    }

    return {
      poolId: res?.id ?? null,
      token1,
      token2,
      token1Amount: res?.token1Amount ?? 0,
      token2Amount: res?.token2Amount ?? 0,
      chainId: payload.chainId,
      fee: res?.fee ?? 0
    };
  }
}
