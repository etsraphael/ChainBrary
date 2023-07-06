import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { PriceFeedContract } from '../../contracts';
import { TokenPair } from '../../enum';

@Injectable({
  providedIn: 'root'
})
export class PriceFeedService {

  async getCurrentPrice(pair: TokenPair, chainId: string): Promise<number> {
    const web3: Web3 = new Web3(window.ethereum);
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

  getCurrentPriceOfNativeToken(chainId: string): Promise<number> {
    let pair: TokenPair;
    switch (chainId) {
      case '11155111':
        pair = TokenPair.EthToUsd;
        break;
      default:
        return Promise.reject('Pair not found');
    }

    return this.getCurrentPrice(pair, chainId);
  }
}
