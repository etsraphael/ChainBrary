import { Injectable } from '@angular/core';
import { NetworkChainId, Web3LoginService } from '@chainbrary/web3-login';
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import { CommunityVaultContract } from '../../contracts';
import { Vault } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CommunityVaultsService {
  constructor(private web3LoginService: Web3LoginService) {}

  async getCommunityVaultsFromTxnHash(rpcUrl: string, txnHash: string, chainId: NetworkChainId): Promise<Vault> {
    const web3: Web3 = new Web3(rpcUrl);
    const communityVaultContract = new CommunityVaultContract(chainId);

    return web3.eth.getTransactionReceipt(txnHash).then((receipt: TransactionReceipt) => {
      const contract: Contract = new web3.eth.Contract(
        communityVaultContract.getAbi() as AbiItem[],
        receipt.contractAddress
      );
      return contract.methods
        .getCommunityVaultMetadata()
        .call()
        .then(
          (
            res: [bigint, bigint, bigint, bigint, bigint, bigint] & {
              totalStaked_: bigint;
              accRewardPerShare_: bigint;
              contractBalance_: bigint;
              fullNetworkReward_: bigint;
              userStaked_: bigint;
              userReward_: bigint;
            }
          ) => ({
            network: {
              contractAddress: receipt.contractAddress,
              networkDetail: this.web3LoginService.getNetworkDetailByChainId(chainId)
            },
            data: {
              TVL: Number(res[0]),
              TVS: Number(res[1]),
              fullNetworkReward: Number(res[3]),
              userStaked: Number(res[4]),
              userReward: Number(res[5])
            }
          })
        )
        .catch((error: Error) => Promise.reject(error));
    });
  }
}
