import { Injectable } from '@angular/core';
import { WalletProvider } from '@chainbrary/web3-login';
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core';
import { Contract, EventData } from 'web3-eth-contract';
import { ContractSendMethod } from 'web3-eth-contract/types';
import { AbiItem } from 'web3-utils';
import { BidContract } from '../../contracts';
import { IReceiptTransaction } from '../../interfaces';
import { IBid, IBidCreation, IBidOffer, IBidRefreshResponse } from '../../interfaces/bid.interface';
import { Web3ProviderService } from '../web3-provider/web3-provider.service';
@Injectable({
  providedIn: 'root'
})
export class BidService {
  constructor(private web3ProviderService: Web3ProviderService) {}

  async getBidFromContractAddress(w: WalletProvider, contractAddress: string): Promise<IBid> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const bidFactoryContract = new BidContract();
    const contract: Contract = new web3.eth.Contract(bidFactoryContract.getAbi() as AbiItem[], contractAddress);

    return contract.methods
      .getCompleteBidMetaData()
      .call()
      .then((res: [string[], string, string, string, string, string[], string[], string, string, string, number]) => {
        return {
          conctractAddress: contractAddress,
          imgLists: res[0],
          bidName: res[1],
          owner: res[2],
          auctionStartTime: new Date(parseInt(res[3]) * 1000),
          auctionEndTime: new Date(parseInt(res[4]) * 1000),
          extendTimeInMinutes: Number(res[5]),
          ownerName: res[8],
          description: res[9],
          highestBid: Number(web3.utils.fromWei(String(res[10]), 'ether'))
        } as IBid;
      });
  }

  async getBidFromTxnHash(w: WalletProvider, txnHash: string): Promise<IBid> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const bidFactoryContract = new BidContract();

    return web3.eth.getTransactionReceipt(txnHash).then((receipt: TransactionReceipt) => {
      const contract: Contract = new web3.eth.Contract(
        bidFactoryContract.getAbi() as AbiItem[],
        receipt.contractAddress
      );
      return contract.methods
        .getCompleteBidMetaData()
        .call()
        .then((res: [string[], string, string, string, string, string, string, string, number]) => {
          return {
            conctractAddress: receipt.contractAddress,
            blockNumber: String(receipt.blockNumber),
            imgLists: res[0],
            bidName: res[1],
            owner: res[2],
            auctionStartTime: new Date(parseInt(res[3]) * 1000),
            auctionEndTime: new Date(parseInt(res[4]) * 1000),
            extendTimeInMinutes: Number(res[5]),
            ownerName: res[6],
            description: res[7],
            highestBid: Number(web3.utils.fromWei(String(res[8]), 'ether'))
          } as IBid;
        })
        .catch((error: string) => Promise.reject(error));
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
    const amountInWei: string = web3.utils.toWei(String(amount), 'ether');

    try {
      const gas: number = await contract.methods.bid().estimateGas({ from, value: amountInWei });
      const receipt: IReceiptTransaction = contract.methods
        .bid()
        .send({ from, value: amountInWei, gas: gas });

      return receipt;
    } catch (error) {
      return Promise.reject(error as string);
    }
  }

  async getBidderList(w: WalletProvider, blockNumber: string, contractAddress: string): Promise<IBidOffer[]> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const bidFactoryContract = new BidContract();
    const contract: Contract = new web3.eth.Contract(bidFactoryContract.getAbi() as AbiItem[], contractAddress);

    return contract
      .getPastEvents('NewBid', {
        fromBlock: blockNumber,
        toBlock: 'latest'
      })
      .then((events: EventData[]) =>
        events
          .map((event: EventData) => ({
            bidderAddress: event.returnValues['bidder'],
            amount: Number(web3.utils.fromWei(String(event.returnValues['amount']), 'ether'))
          }))
          .sort((a: IBidOffer, b: IBidOffer) => b.amount - a.amount)
      )
      .catch((error: string) => Promise.reject(error));
  }

  async deployBidContract(
    w: WalletProvider,
    from: string,
    bid: IBidCreation
  ): Promise<{ contract: Contract; transactionHash: string }> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const bidFactoryContract = new BidContract();
    const contractData = {
      data: bidFactoryContract.getByteCode(),
      arguments: [
        bid.communityAddress,
        bid.extendTimeInMinutes,
        bid.durationInMinutes,
        bid.imgLists,
        bid.bidName,
        bid.ownerName,
        bid.description
      ]
    };

    const contract = new web3.eth.Contract(bidFactoryContract.getAbi() as AbiItem[]);

    try {
      const deployment: ContractSendMethod = contract.deploy(contractData);
      const gasEstimate: number = await deployment.estimateGas();

      return new Promise((resolve, reject) => {
        deployment
          .send({
            from,
            gas: gasEstimate
          })
          .on('transactionHash', (hash) => {
            resolve({ contract, transactionHash: hash });
          })
          .on('error', (error) => {
            reject((error as Error)?.message || error);
          });
      });
    } catch (error) {
      return Promise.reject((error as Error)?.message || error);
    }
  }

  async getBidderListWithDetails(w: WalletProvider, blockNumber: string, contractAddress: string): Promise<IBidRefreshResponse> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const contract: Contract = new web3.eth.Contract(new BidContract().getAbi() as AbiItem[], contractAddress);

    try {
      const bidList = await contract.getPastEvents('NewBid', {
        fromBlock: blockNumber,
        toBlock: 'latest'
      });

      const highestBid = await contract.methods.highestBid().call();
      const auctionEndTime = await contract.methods.auctionEndTime().call();

      const list = bidList.map((event: EventData) => ({
        bidderAddress: event.returnValues['bidder'],
        amount: Number(web3.utils.fromWei(String(event.returnValues['amount']), 'ether'))
      })).sort((a: IBidOffer, b: IBidOffer) => b.amount - a.amount);

      return {
        list: list,
        highestBid: Number(web3.utils.fromWei(String(highestBid), 'ether')),
        auctionEndTime: new Date(parseInt(auctionEndTime) * 1000)
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

}
