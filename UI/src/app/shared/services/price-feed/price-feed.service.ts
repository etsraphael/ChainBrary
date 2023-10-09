import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { PriceFeedContract } from '../../contracts';
import { TokenPair } from '../../enum';
import { NetworkChainId, WalletProvider } from '@chainbrary/web3-login';
import { Web3ProviderService } from '../../web3-provider/web3-provider.service';

@Injectable({
  providedIn: 'root'
})
export class PriceFeedService {
  constructor(private web3ProviderService: Web3ProviderService) {}

  async getCurrentPrice(pair: TokenPair, chainId: NetworkChainId, w: WalletProvider): Promise<number> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const transactionContract = new PriceFeedContract(chainId, pair);

    if (!transactionContract.getPairAddress()) {
      return Promise.reject('Pair not found');
    }

    const contract: Contract = new web3.eth.Contract(transactionContract.getAbi(), transactionContract.getAddress());

    return contract.methods
      .getLatestDataFrom(transactionContract.getPairAddress())
      .call()
      .then((result: { answer: string; startedAt: string }) => {
        const convertedNum = Number(result.answer) / Math.pow(10, 8);
        return convertedNum.toFixed(2);
      });
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
}
