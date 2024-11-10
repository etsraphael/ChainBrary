import { Injectable } from '@angular/core';
import Web3, { AbiFragment, Contract } from 'web3';
import { AbiItem } from 'web3-utils';
import { PoolContract, PoolDetailObjectResponse, SwapRouterContract, SwapRouterObjectResponse } from '../../contracts';
import { SwapFactoryContract } from '../../contracts/swapFactory';
import { ITokenContract } from '../../interfaces';
import { ILiquidityPayload, IPoolDetail, IPoolSearch, SwapPayload } from '../../interfaces/swap.interface';
import { Web3ProviderService } from '../web3-provider/web3-provider.service';

@Injectable({
  providedIn: 'root'
})
export class DexService {
  constructor(private web3ProviderService: Web3ProviderService) {}

  private isAmountsOutResponseValid(res: unknown): res is SwapRouterObjectResponse {
    if (typeof res !== 'object' || res === null) {
      return false;
    }

    const obj = res as { [key: string]: unknown };

    return typeof obj[0] === 'bigint' && obj['__length__'] === 'number';
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

  async getAmountsOut(rpcUrl: string, payload: SwapPayload): Promise<number[]> {
    const web3: Web3 = new Web3(rpcUrl);
    const swapRouterContract = new SwapRouterContract(payload.chainId);

    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
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

    return contract.methods['getAmountsOut'](payload.amount, [tokenInAddress, tokenOutAddress], 100)
      .call()
      .then((res: void | [] | SwapRouterObjectResponse) => {
        if (!this.isAmountsOutResponseValid(res)) {
          return Promise.reject('Invalid amounts out response');
        }

        return res[0].map((value: bigint) => Number(web3.utils.fromWei(String(value), 'ether')));
      });
  }

  async addLiquidity(rpcUrl: string, from: string, payload: ILiquidityPayload): Promise<string> {
    const token1Address: string | undefined = payload.token1.networkSupport.find(
      (network: ITokenContract) => network.chainId === payload.chainId
    )?.address;
    const token2Address: string | undefined = payload.token2.networkSupport.find(
      (network: ITokenContract) => network.chainId === payload.chainId
    )?.address;

    if (!token1Address || !token2Address) {
      return Promise.reject('Token not supported on this network');
    }

    const web3: Web3 = new Web3(rpcUrl);
    const swapRouterContract = new SwapFactoryContract(payload.chainId);

    const swapRouterFragment: Contract<AbiFragment[]> = new web3.eth.Contract(
      swapRouterContract.getAbi() as AbiItem[],
      swapRouterContract.getAddress()
    );

    return swapRouterFragment.methods['getPool'](payload.token1, payload.token2, '100')
      .call()
      .then((res: void | [] | any) => {
        // TODO: Remove any soon
        const poolContract = new PoolContract(payload.chainId);
        const poolFragment: Contract<AbiFragment[]> = new web3.eth.Contract(
          poolContract.getAbi() as AbiItem[],
          res.address // TODO: get the address from the response
        );

        return poolFragment.methods['addLiquidity'](
          token1Address,
          token2Address,
          payload.token1Amount,
          payload.token2Amount,
          0,
          0,
          payload.token1Amount,
          payload.token2Amount,
          from
        )
          .send({ from: from })
          .then((res) => {
            if (!this.isAmountsOutResponseValid(res)) {
              return Promise.reject('Invalid liquidity response');
            }

            return 'Liquidity added';
          });
      });
  }

  // TODO: Currently working, but need to replace the hardcoded addresses
  async getPool(search: IPoolSearch): Promise<IPoolDetail> {
    const web3: Web3 = new Web3(this.web3ProviderService.getRpcUrl(search.chainId));
    const swapRouterContract = new SwapFactoryContract(search.chainId);

    const swapRouterFragment: Contract<AbiFragment[]> = new web3.eth.Contract(
      swapRouterContract.getAbi() as AbiItem[],
      swapRouterContract.getAddress()
    );

    return swapRouterFragment.methods['getPool'](
      '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      swapRouterContract.fee
    )
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
      .catch((error: string) => {
        console.log('error', error);
        return Promise.reject(error);
      });
  }

  async createPool(from: string, payload: ILiquidityPayload): Promise<IPoolDetail> {
    const web3: Web3 = new Web3(this.web3ProviderService.getRpcUrl(payload.chainId));
    const swapRouterContract = new SwapFactoryContract(payload.chainId);

    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      swapRouterContract.getAbi() as AbiItem[],
      swapRouterContract.getAddress()
    );

    // const token1Address: string | undefined = payload.token1.networkSupport.find(
    //   (network: ITokenContract) => network.chainId === payload.chainId
    // )?.address;
    // const token2Address: string | undefined = payload.token2.networkSupport.find(
    //   (network: ITokenContract) => network.chainId === payload.chainId
    // )?.address;

    // if (!token1Address || !token2Address) {
    //   return Promise.reject('Token not supported on this network');
    // }

    const gas: bigint = await contract.methods['createPool'](
      '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      swapRouterContract.fee
    ).estimateGas({ from });

    return contract.methods['createPool'](
      '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      swapRouterContract.fee
    )
      .send({ from, gas: gas.toString() })
      .then(async () => {
        // After pool creation, get the pool address
        const poolAddress = await contract.methods['getPool'](
          '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
          '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          swapRouterContract.fee
        ).call();

        if (
          typeof poolAddress !== 'string' ||
          web3.utils.isNullish(poolAddress) ||
          poolAddress === '0x0000000000000000000000000000000000000000'
        ) {
          return Promise.reject('Pool not found after creation');
        }

        // Get pool details
        const poolContract = new PoolContract(payload.chainId);
        const poolFragment: Contract<AbiFragment[]> = new web3.eth.Contract(
          poolContract.getAbi() as AbiItem[],
          poolAddress
        );

        const poolDetailResponse: PoolDetailObjectResponse = await poolFragment.methods['getPoolDetails']().call();

        if (!this.isPoolDetailResponseValid(poolDetailResponse)) {
          return Promise.reject('Invalid pool detail response');
        }

        const poolDetail: IPoolDetail = {
          id: poolAddress,
          token1Address: poolDetailResponse[0],
          token2Address: poolDetailResponse[1],
          fee: Number(web3.utils.fromWei(String(poolDetailResponse[2]), 'ether')),
          token1Amount: Number(web3.utils.fromWei(String(poolDetailResponse[3]), 'ether')),
          token2Amount: Number(web3.utils.fromWei(String(poolDetailResponse[4]), 'ether')),
          chainId: payload.chainId
        };

        return poolDetail;
      })
      .catch((error: string) => Promise.reject(error));
  }
}
