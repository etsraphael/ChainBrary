import { Injectable } from '@angular/core';
import { NetworkChainId, WalletProvider, Web3LoginService } from '@chainbrary/web3-login';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import { CommunityVaultContract } from '../../contracts';
import { IReceiptTransaction, Vault } from '../../interfaces';
import { Web3ProviderService } from '../web3-provider/web3-provider.service';

@Injectable({
  providedIn: 'root'
})
export class CommunityVaultsService {
  constructor(
    private web3LoginService: Web3LoginService,
    private web3ProviderService: Web3ProviderService
  ) {}

  async getCommunityVaultByChainId(rpcUrl: string, chainId: NetworkChainId): Promise<Vault> {
    const web3: Web3 = new Web3(rpcUrl);
    const communityVaultContract = new CommunityVaultContract(chainId);

    const contract: Contract = new web3.eth.Contract(
      communityVaultContract.getAbi() as AbiItem[],
      communityVaultContract.getAddress()
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
            contractAddress: communityVaultContract.getAddress(),
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
  }

  async addTokensToVault(
    w: WalletProvider,
    chainId: NetworkChainId,
    amount: number,
    from: string
  ): Promise<IReceiptTransaction> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const communityVaultContract = new CommunityVaultContract(chainId);

    const contract: Contract = new web3.eth.Contract(
      communityVaultContract.getAbi() as AbiItem[],
      communityVaultContract.getAddress()
    );
    const amountInWei: string = web3.utils.toWei(String(amount), 'ether');

    try {
      const gas: number = await contract.methods.deposit().estimateGas({ from, value: amountInWei });
      const receipt: IReceiptTransaction = contract.methods.deposit().send({ from, value: amountInWei, gas: gas });

      return receipt;
    } catch (error) {
      return Promise.reject(error as string);
    }
  }
}
