import { Injectable } from '@angular/core';
import Web3, { AbiFragment, Contract } from 'web3';
import { AbiItem } from 'web3-utils';
import { SwapRouterContract, SwapRouterObjectResponse } from '../../contracts';
import { ITokenContract } from '../../interfaces';
import { SwapPayload } from '../../interfaces/swap.interface';

@Injectable({
  providedIn: 'root'
})
export class DexService {
  constructor() {}

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
}
