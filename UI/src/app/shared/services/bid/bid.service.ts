import { Injectable } from '@angular/core';
import { NetworkChainId, WalletProvider } from '@chainbrary/web3-login';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { IBidResponse } from '../../interfaces/bid.interface';
import { Web3ProviderService } from '../web3-provider/web3-provider.service';
import { BidContract } from '../../contracts';

@Injectable({
  providedIn: 'root'
})
export class BidService {

  constructor(private web3ProviderService: Web3ProviderService) {}

  getBidFromTxnHash(w: WalletProvider, txHash: string, networkChainId: NetworkChainId): Promise<IBidResponse> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const bidFactoryContract = new BidContract();

    // TODO: create a value in ENV to filter by network supported

    const contract: Contract = new web3.eth.Contract(bidFactoryContract.getAbi(), txHash);

    return contract.methods.auctionStartTime().call();
  }
}
