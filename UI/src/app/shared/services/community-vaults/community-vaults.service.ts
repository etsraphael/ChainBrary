import { Injectable } from '@angular/core';
import { NetworkChainId, WalletProvider, Web3LoginService } from '@chainbrary/web3-login';
import Web3, { AbiFragment } from 'web3';
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

  async getCommunityVaultByChainId(rpcUrl: string, chainId: NetworkChainId, from: string | null): Promise<Vault | any> {
    const web3: Web3 = new Web3(rpcUrl);
    const communityVaultContract = new CommunityVaultContract(chainId);

    const contract = new web3.eth.Contract(
      communityVaultContract.getAbi() as AbiItem[],
      communityVaultContract.getAddress()
    );
    return contract.methods['getCommunityVaultMetadata']()
      .call({ from: from || '0x0000000000000000000000000000000000000000' })
      .then(( res: any ) => ({
          network: {
            contractAddress: communityVaultContract.getAddress(),
            networkDetail: this.web3LoginService.getNetworkDetailByChainId(chainId)
          },
          data: {
            TVL: Number(web3.utils.fromWei(String(res[2]), 'ether')),
            TVS: Number(web3.utils.fromWei(String(res[0]), 'ether')),
            fullNetworkReward: Number(web3.utils.fromWei(String(res[3]), 'ether')),
            userStaked: Number(web3.utils.fromWei(String(res[4]), 'ether')),
            userReward: Number(web3.utils.fromWei(String(res[5]), 'ether'))
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
  ): Promise<IReceiptTransaction | any> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const communityVaultContract = new CommunityVaultContract(chainId);

    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      communityVaultContract.getAbi() as AbiItem[],
      communityVaultContract.getAddress()
    );
    const amountInWei: string = web3.utils.toWei(String(amount), 'ether');

    try {
      const gas: bigint = await contract.methods['deposit']().estimateGas({ from, value: amountInWei });
      const receipt = contract.methods['deposit']().send({ from, value: amountInWei, gas: gas.toString() });

      return receipt;
    } catch (error) {
      return Promise.reject(error as string);
    }
  }

  async withdrawTokensFromVault(
    w: WalletProvider,
    chainId: NetworkChainId,
    from: string
  ): Promise<IReceiptTransaction | any> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const communityVaultContract = new CommunityVaultContract(chainId);

    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      communityVaultContract.getAbi() as AbiItem[],
      communityVaultContract.getAddress()
    );

    try {
      const gas: bigint = await contract.methods['withdraw']().estimateGas({ from });
      const receipt = contract.methods['withdraw']().send({ from, gas: gas.toString() });

      return receipt;
    } catch (error) {
      return Promise.reject(error as string);
    }
  }
}
