import { Injectable } from '@angular/core';
import { WalletProvider } from '@chainbrary/web3-login';
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core';
import { Contract } from 'web3-eth-contract';
import { ContractSendMethod } from 'web3-eth-contract/types';
import { AbiItem } from 'web3-utils';
import { DocumentLockerContract } from '../../contracts';
import { IDocumentLockerCreation, IDocumentLockerResponse } from '../../interfaces';
import { Web3ProviderService } from '../web3-provider/web3-provider.service';
import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentLockerService {
  constructor(private web3ProviderService: Web3ProviderService) {}

  async deployDocumentLockerContract(
    w: WalletProvider,
    from: string,
    dl: IDocumentLockerCreation
  ): Promise<{ contract: Contract; transactionHash: string }> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const dlFactoryContract = new DocumentLockerContract();
    const contractData = {
      data: dlFactoryContract.getByteCode(),
      arguments: [environment.communityAddress, dl.documentName, '', dl.price, dl.desc]
    };

    const contract = new web3.eth.Contract(dlFactoryContract.getAbi() as AbiItem[]);

    try {
      const deployment: ContractSendMethod = contract.deploy(contractData);
      const gasEstimate: number = await web3.eth.estimateGas({
        from,
        data: deployment.encodeABI()
      });

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

  async getDocumentLockerFromTxnHash(w: WalletProvider, txnHash: string): Promise<IDocumentLockerResponse> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const dlFactoryContract = new DocumentLockerContract();

    return web3.eth.getTransactionReceipt(txnHash).then((receipt: TransactionReceipt) => {
      const contract: Contract = new web3.eth.Contract(
        dlFactoryContract.getAbi() as AbiItem[],
        receipt.contractAddress
      );
      return contract.methods
        .getDocumentData()
        .call()
        .then((res: [string, string, number, string]) => {
          return {
            documentName: res[0],
            ownerName: res[1],
            price: res[2],
            ownerAddress: res[3]
          } as IDocumentLockerResponse;
        })
        .catch((error: string) => Promise.reject(error));
    });
  }
}
