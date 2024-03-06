import { Injectable } from '@angular/core';
import { NetworkChainId, WalletProvider } from '@chainbrary/web3-login';
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import { CommunityVaultContract } from '../../contracts';
import { Vault } from '../../interfaces';
import { Web3ProviderService } from '../web3-provider/web3-provider.service';

@Injectable({
  providedIn: 'root'
})
export class CommunityVaultsService {
  constructor(private web3ProviderService: Web3ProviderService) {}

  async getBidFromTxnHash(w: WalletProvider, txnHash: string, chainId: NetworkChainId): Promise<Vault> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const communityVaultContract = new CommunityVaultContract(chainId);

    return web3.eth.getTransactionReceipt(txnHash).then((receipt: TransactionReceipt) => {
      const contract: Contract = new web3.eth.Contract(
        communityVaultContract.getAbi() as AbiItem[],
        receipt.contractAddress
      );
      return (
        contract.methods
          .getCommunityVaultMetadata()
          .call()
          // .then((res) => {
          //   return {
          //     conctractAddress: receipt.contractAddress,
          //     blockNumber: String(receipt.blockNumber),
          //     imgLists: res[0],
          //     bidName: res[1],
          //     owner: res[2],
          //     auctionStartTime: new Date(parseInt(res[3]) * 1000),
          //     auctionEndTime: new Date(parseInt(res[4]) * 1000),
          //     extendTimeInMinutes: Number(res[5]),
          //     ownerName: res[6],
          //     description: res[7],
          //     highestBid: Number(web3.utils.fromWei(String(res[8]), 'ether')),
          //     auctionAmountWithdrawn: res[9]
          //   } as Vault;
          // })
          .catch((error: string) => Promise.reject(error))
      );
    });
  }
}
