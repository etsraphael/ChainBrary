import { Injectable } from '@angular/core';
import Web3, { AbiFragment, Contract } from 'web3';
import { AbiItem } from 'web3-utils';
import { PoolContract, SwapRouterContract, SwapRouterObjectResponse } from '../../contracts';
import { SwapFactoryContract } from '../../contracts/swapFactory';
import { ITokenContract } from '../../interfaces';
import { ILiquidityPayload, IPoolSearch, SwapPayload } from '../../interfaces/swap.interface';
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
  async getPool(search: IPoolSearch): Promise<string> {
    const web3: Web3 = new Web3(this.web3ProviderService.getRpcUrl(search.chainId));
    const swapRouterContract = new SwapFactoryContract(search.chainId);

    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      swapRouterContract.getAbi() as AbiItem[],
      swapRouterContract.getAddress()
    );

    return contract.methods['getPool'](
      '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      swapRouterContract.fee
    )
      .call()
      .then((res: void | [] | string) => {
        if(web3.utils.isNullish(res) || res === '0x0000000000000000000000000000000000000000') return Promise.reject('Pool_not_found')
        else return res as string;
      })
      .catch((error: string) => {
        console.log('error', error);
        return Promise.reject(error);
      });
  }
}
