import { Injectable } from '@angular/core';
import { WalletProvider } from '@chainbrary/web3-login';
import Web3, { AbiFragment, ContractEvents, EventLog, FMT_NUMBER, NumberTypes, TransactionReceipt } from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import { BidContract, BidObjectResponse } from '../../contracts';
import { IReceiptTransaction } from '../../interfaces';
import { IBid, IBidCreation, IBidOffer, IBidRefreshResponse } from '../../interfaces/bid.interface';
import { Web3ProviderService } from '../web3-provider/web3-provider.service';

@Injectable({
  providedIn: 'root'
})
export class BidService {
  constructor(private web3ProviderService: Web3ProviderService) {}

  isBidResponseValid(res: unknown): res is BidObjectResponse {
    if (typeof res !== 'object' || res === null) {
      return false;
    }

    const obj = res as { [key: string]: unknown };

    return (
      Array.isArray(obj[0]) &&
      typeof obj[1] === 'string' &&
      typeof obj[2] === 'string' &&
      typeof obj[3] === 'bigint' &&
      typeof obj[4] === 'bigint' &&
      typeof obj[5] === 'bigint' &&
      typeof obj[6] === 'string' &&
      typeof obj[7] === 'string' &&
      typeof obj[8] === 'bigint' &&
      typeof obj[9] === 'boolean' &&
      typeof obj['__length__'] === 'number' &&
      Object.keys(obj).length === 11
    );
  }

  async getBidFromTxnHash(w: WalletProvider, txnHash: string): Promise<IBid> {
    const web3: Web3 = new Web3('http://127.0.0.1:8545/');
    const bidFactoryContract = new BidContract();

    return web3.eth.getTransactionReceipt(txnHash).then(async (receipt: TransactionReceipt) => {
      const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
        bidFactoryContract.getAbi() as AbiItem[],
        receipt.contractAddress
      );
      return contract.methods['getCompleteBidMetaData']()
        .call()
        .then((res: void | [] | BidObjectResponse) => {
          if (!this.isBidResponseValid(res)) {
            return Promise.reject('Invalid bid response');
          }

          return {
            conctractAddress: receipt.contractAddress,
            blockNumber: String(receipt.blockNumber),
            imgLists: res[0],
            bidName: res[1],
            owner: res[2],
            auctionStartTime: new Date(Number(res[3]) * 1000),
            auctionEndTime: new Date(Number(res[4]) * 1000),
            extendTimeInMinutes: Number(res[5]),
            ownerName: res[6],
            description: res[7],
            highestBid: Number(web3.utils.fromWei(String(res[8]), 'ether')),
            auctionAmountWithdrawn: res[9]
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
    const web3: Web3 = new Web3('http://127.0.0.1:8545/');

    const bidFactoryContract = new BidContract();
    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      bidFactoryContract.getAbi() as AbiItem[],
      contractAddress
    );
    const amountInWei: string = web3.utils.toWei(String(amount), 'ether');

    try {
      const gas: bigint = await contract.methods['bid']().estimateGas({ from, value: amountInWei });
      const receipt = await contract.methods['bid']().send({ from, value: amountInWei, gas: gas.toString() });

      const convertedReceipt: IReceiptTransaction = {
        blockHash: receipt.blockHash,
        blockNumber: Number(receipt.blockNumber),
        contractAddress: contractAddress,
        transactionIndex: Number(receipt.transactionIndex),
        cumulativeGasUsed: Number(receipt.cumulativeGasUsed),
        effectiveGasPrice: Number(receipt.effectiveGasPrice),
        from: receipt.from,
        gasUsed: Number(receipt.gasUsed),
        logsBloom: receipt.logsBloom,
        status: receipt.status,
        to: receipt.to,
        transactionHash: receipt.transactionHash,
        type: receipt.type
      };

      return convertedReceipt;
    } catch (error) {
      return Promise.reject(error as string);
    }
  }

  async getBidderList(w: WalletProvider, blockNumber: string, contractAddress: string): Promise<IBidOffer[]> {
    const web3: Web3 = new Web3('http://127.0.0.1:8545/');
    const bidFactoryContract = new BidContract();
    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      bidFactoryContract.getAbi() as AbiItem[],
      contractAddress
    );

    return contract
      .getPastEvents('NewBid' as keyof ContractEvents<AbiFragment[]>, {
        fromBlock: blockNumber,
        toBlock: 'latest'
      })
      .then((events: (string | EventLog)[]) => {
        return events
          .map((event: string | EventLog) => event as EventLog)
          .map((event: EventLog) => ({
            bidderAddress: event.returnValues['bidder'] as string,
            amount: Number(web3.utils.fromWei(String(event.returnValues['amount']), 'ether'))
          }))
          .sort((a: IBidOffer, b: IBidOffer) => b.amount - a.amount);
      })
      .catch((error: string) => {
        return Promise.reject(error);
      });
  }

  async deployBidContract(
    w: WalletProvider,
    from: string,
    bid: IBidCreation
  ): Promise<{ contract: Contract<AbiFragment[]>; transactionHash: string }> {
    const web3: Web3 = new Web3('http://127.0.0.1:8545/');
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
      const deployment = contract.deploy(contractData);
      const gasEstimate: NumberTypes[FMT_NUMBER.BIGINT] = await web3.eth.estimateGas({
        from,
        data: deployment.encodeABI()
      });

      return new Promise((resolve, reject) => {
        deployment
          .send({
            from,
            gas: String(gasEstimate)
          })
          .on('transactionHash', (hash) => {
            resolve({ contract, transactionHash: String(hash) });
          })
          .on('error', (error) => {
            reject((error as Error)?.message || error);
          });
      });
    } catch (error) {
      return Promise.reject((error as Error)?.message || error);
    }
  }

  async getBidderListWithDetails(
    w: WalletProvider,
    blockNumber: string,
    contractAddress: string
  ): Promise<IBidRefreshResponse> {
    const web3: Web3 = new Web3('http://127.0.0.1:8545/');
    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      new BidContract().getAbi() as AbiItem[],
      contractAddress
    );

    try {
      const bidList: (string | EventLog)[] = await contract.getPastEvents(
        'NewBid' as keyof ContractEvents<AbiFragment[]>,
        {
          fromBlock: blockNumber,
          toBlock: 'latest'
        }
      );

      if (typeof bidList === 'string') {
        return Promise.reject('Error fetching bid list');
      }

      const highestBid: bigint = await contract.methods['highestBid']().call();
      const auctionEndTime: bigint = await contract.methods['auctionEndTime']().call();

      const list: IBidOffer[] = bidList
        .map((event: string | EventLog) => event as EventLog)
        .map((event: EventLog) => ({
          bidderAddress: event.returnValues['bidder'] as string,
          amount: Number(web3.utils.fromWei(String(event.returnValues['amount']), 'ether'))
        }))
        .sort((a: IBidOffer, b: IBidOffer) => b.amount - a.amount);

      return {
        list: list,
        highestBid: Number(web3.utils.fromWei(String(highestBid), 'ether')),
        auctionEndTime: new Date(Number(auctionEndTime) * 1000)
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async requestWithdraw(w: WalletProvider, from: string, contractAddress: string): Promise<IReceiptTransaction> {
    const web3: Web3 = new Web3('http://127.0.0.1:8545/');
    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      new BidContract().getAbi() as AbiItem[],
      contractAddress
    );

    try {
      const gas: bigint = await contract.methods['withdrawAuctionAmount']().estimateGas({ from });
      const receipt = await contract.methods['withdrawAuctionAmount']().send({ from, gas: gas.toString() });

      const convertedReceipt: IReceiptTransaction = {
        blockHash: receipt.blockHash,
        blockNumber: Number(receipt.blockNumber),
        contractAddress: receipt.contractAddress as string,
        transactionIndex: Number(receipt.transactionIndex),
        cumulativeGasUsed: Number(receipt.cumulativeGasUsed),
        effectiveGasPrice: Number(receipt.effectiveGasPrice),
        from: receipt.from,
        gasUsed: Number(receipt.gasUsed),
        logsBloom: receipt.logsBloom,
        status: receipt.status,
        to: receipt.to,
        transactionHash: receipt.transactionHash,
        type: receipt.type
      };

      return convertedReceipt;
    } catch (error) {
      return Promise.reject(error as string);
    }
  }
}
