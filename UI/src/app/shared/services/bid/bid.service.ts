import { Injectable } from '@angular/core';
import { WalletProvider } from '@chainbrary/web3-login';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import { BidContract } from '../../contracts';
import { IReceiptTransaction } from '../../interfaces';
import { IBid } from '../../interfaces/bid.interface';
import { Web3ProviderService } from '../web3-provider/web3-provider.service';

@Injectable({
  providedIn: 'root'
})
export class BidService {
  constructor(private web3ProviderService: Web3ProviderService) {}

  async getBidFromTxnHash(w: WalletProvider, txHash: string): Promise<IBid> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const bidFactoryContract = new BidContract();
    const contract: Contract = new web3.eth.Contract(bidFactoryContract.getAbi() as AbiItem[], txHash);

    return contract.methods
      .getCompleteBidMetaData()
      .call()
      .then((res: [string[], string, string, string, string, string[], string[], string, string, string, number]) => {
        return {
          conctractAddress: txHash,
          imgLists: res[0],
          bidName: res[1],
          owner: res[2],
          auctionStartTime: new Date(parseInt(res[3]) * 1000),
          auctionEndTime: new Date(parseInt(res[4]) * 1000),
          extendTimeInMinutes: Number(res[5]),
          ownerName: res[8],
          description: res[9],
          highestBid: Number(res[10])
        } as IBid;
      });
  }

  async placeBid(
    w: WalletProvider,
    from: string,
    amount: number,
    contractAddress: string
  ): Promise<IReceiptTransaction> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const bidFactoryContract = new BidContract();

    const contract: Contract = new web3.eth.Contract(bidFactoryContract.getAbi() as AbiItem[], contractAddress);

    try {
      const gas: number = await contract.methods.bid().estimateGas({ from, value: String(amount) });

      const receipt: IReceiptTransaction = contract.methods.bid().send({ from, value: String(amount), gas: gas });

      return receipt;
    } catch (error) {
      return Promise.reject((error as { message: string; code: number }) || error);
    }
  }
}
