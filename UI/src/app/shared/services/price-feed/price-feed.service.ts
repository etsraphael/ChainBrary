import { Injectable } from '@angular/core';
import { NetworkChainId, WalletProvider } from '@chainbrary/web3-login';
import Web3, { AbiFragment, Contract } from 'web3';
import { PriceFeedContract, PriceFeedObjectResponse } from '../../contracts';
import { TokenPair } from '../../enum';
import { Web3ProviderService } from '../web3-provider/web3-provider.service';
import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PriceFeedService {
  constructor(private web3ProviderService: Web3ProviderService) {}

  // TODO: Use node every time when UI ready, and rename it

  isPriceResponseValid(res: unknown): res is PriceFeedObjectResponse {
    if (typeof res !== 'object' || res === null) {
      return false;
    }

    const obj = res as { [key: string]: unknown };

    return (
      typeof obj[0] === 'bigint' &&
      typeof obj[1] === 'bigint' &&
      typeof obj[2] === 'bigint' &&
      typeof obj[3] === 'bigint' &&
      typeof obj[4] === 'bigint' &&
      typeof obj['__length__'] === 'number'
    );
  }

  async getCurrentPrice(pair: TokenPair, chainId: NetworkChainId, w: WalletProvider): Promise<number> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const transactionContract = new PriceFeedContract(chainId, pair);

    if (!transactionContract.getPairAddress()) {
      return Promise.reject('Pair not found');
    }

    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      transactionContract.getAbi(),
      transactionContract.getAddress()
    );

    try {
      const res: void | [] | PriceFeedObjectResponse = await contract.methods['getLatestDataFrom'](
        transactionContract.getPairAddress()
      ).call();

      if (!this.isPriceResponseValid(res)) {
        throw new Error('Invalid price response');
      }

      const convertedNum: number = Number((res as PriceFeedObjectResponse).answer) / Math.pow(10, 8);
      return Number(convertedNum.toFixed(2));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getCurrentPriceOfNativeToken(chainId: NetworkChainId, w: WalletProvider): Promise<number> {
    let pair: TokenPair;
    switch (chainId) {
      case NetworkChainId.ETHEREUM:
      case NetworkChainId.SEPOLIA:
        pair = TokenPair.EthToUsd;
        break;
      case NetworkChainId.BNB:
        pair = TokenPair.BnbToUsd;
        break;
      case NetworkChainId.AVALANCHE:
        pair = TokenPair.AvaxToUsd;
        break;
      case NetworkChainId.POLYGON:
        pair = TokenPair.MaticToUsd;
        break;
      default:
        return Promise.reject('Pair not found');
    }

    return this.getCurrentPrice(pair, chainId, w);
  }

  async getCurrentPriceFromNode(pair: TokenPair, chainId: NetworkChainId): Promise<number> {
    const rpcUrl = this.getRpcUrl(chainId);
    const web3: Web3 = new Web3(rpcUrl);
    const transactionContract = new PriceFeedContract(chainId, pair);

    if (!transactionContract.getPairAddress()) {
      return Promise.reject('Pair not found');
    }

    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      transactionContract.getAbi(),
      transactionContract.getAddress()
    );

    try {
      const res: void | [] | PriceFeedObjectResponse = await contract.methods['getLatestDataFrom'](
        transactionContract.getPairAddress()
      ).call();

      if (!this.isPriceResponseValid(res)) {
        throw new Error('Invalid price response');
      }

      const convertedNum = Number((res as PriceFeedObjectResponse).answer) / Math.pow(10, 8);
      return Number(convertedNum.toFixed(2));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getCurrentPriceOfNativeTokenFromNode(chainId: NetworkChainId): Promise<number> {
    let pair: TokenPair;
    switch (chainId) {
      case NetworkChainId.ETHEREUM:
      case NetworkChainId.SEPOLIA:
        pair = TokenPair.EthToUsd;
        break;
      case NetworkChainId.BNB:
        pair = TokenPair.BnbToUsd;
        break;
      case NetworkChainId.AVALANCHE:
        pair = TokenPair.AvaxToUsd;
        break;
      case NetworkChainId.POLYGON:
        pair = TokenPair.MaticToUsd;
        break;
      default:
        return Promise.reject('Pair not found');
    }

    return this.getCurrentPriceFromNode(pair, chainId);
  }

  private getRpcUrl(chainId: NetworkChainId): string {
    switch (chainId) {
      case NetworkChainId.ETHEREUM:
        return environment.rpcKeys.eth;
      case NetworkChainId.BNB:
        return environment.rpcKeys.bnb;
      case NetworkChainId.AVALANCHE:
        return environment.rpcKeys.avalanche;
      case NetworkChainId.POLYGON:
        return environment.rpcKeys.polygon;
      case NetworkChainId.SEPOLIA:
        return environment.rpcKeys.sepolia;
      default:
        return '';
    }
  }
}
