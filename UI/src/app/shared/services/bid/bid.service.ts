import { Injectable } from '@angular/core';
import { NetworkChainId, WalletProvider } from '@chainbrary/web3-login';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import { BidContract } from '../../contracts';
import { Web3ProviderService } from '../web3-provider/web3-provider.service';
import { IBid } from '../../interfaces/bid.interface';

@Injectable({
  providedIn: 'root'
})
export class BidService {
  constructor(private web3ProviderService: Web3ProviderService) {}

  async getBidFromTxnHash(w: WalletProvider, txHash: string, networkChainId: NetworkChainId): Promise<IBid> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const bidFactoryContract = new BidContract();

    // TODO: create a value in ENV to filter by network supported

    const contract: Contract = new web3.eth.Contract(bidFactoryContract.getAbi() as AbiItem[], txHash);

    return contract.methods
      .getCompleteBidMetaData()
      .call()
      .then((res: [string[], string, string, string, string, string]) => {
        return {
          imgLists: res[0],
          bidName: res[1],
          owner: res[2],
          auctionStartTime: new Date(parseInt(res[3]) * 1000),
          auctionEndTime: new Date(parseInt(res[4]) * 1000),
          extendTimeInMinutes: Number(res[5])
        } as IBid;
      });
  }
}
