import { Injectable } from '@angular/core';
import { WalletProvider } from '@chainbrary/web3-login';
import Web3, { AbiFragment, TransactionReceipt } from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import { DocumentDataObjectResponse, DocumentLockerContract, FullDocumentDataObjectResponse } from '../../contracts';
import { IDocumentLockerCreation, IDocumentLockerResponse, IReceiptTransaction } from '../../interfaces';
import { Web3ProviderService } from '../web3-provider/web3-provider.service';
import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentLockerService {
  constructor(private web3ProviderService: Web3ProviderService) {}

  private isDocumentDataResponseValid(res: unknown): res is DocumentDataObjectResponse {
    if (typeof res !== 'object' || res === null) {
      return false;
    }

    const obj = res as { [key: string]: unknown };

    return (
      typeof obj[0] === 'string' &&
      typeof obj[1] === 'string' &&
      typeof obj[2] === 'bigint' &&
      typeof obj[3] === 'string' &&
      typeof obj[4] === 'string' &&
      typeof obj['__length__'] === 'number'
    );
  }

  private isFullDocumentDataObjectResponseResponseValid(res: unknown): res is FullDocumentDataObjectResponse {
    if (typeof res !== 'object' || res === null) {
      return false;
    }

    const obj = res as { [key: string]: unknown };

    return (
      typeof obj[0] === 'string' &&
      typeof obj[1] === 'string' &&
      typeof obj[2] === 'bigint' &&
      typeof obj[3] === 'string' &&
      typeof obj[4] === 'string' &&
      typeof obj[5] === 'string' &&
      typeof obj['__length__'] === 'number'
    );
  }

  async deployDocumentLockerContract(
    w: WalletProvider,
    from: string,
    dl: IDocumentLockerCreation
  ): Promise<{ contract: Contract<AbiFragment[]>; transactionHash: string }> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const dlFactoryContract = new DocumentLockerContract();
    const contractData = {
      data: dlFactoryContract.getByteCode(),
      arguments: [environment.communityAddress, dl.documentName, dl.ownerName, dl.price, dl.desc]
    };

    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(dlFactoryContract.getAbi() as AbiItem[]);

    try {
      const deployment = contract.deploy(contractData);
      const gasEstimate: bigint = await web3.eth.estimateGas({
        from,
        data: deployment.encodeABI()
      });

      return new Promise((resolve, reject) => {
        deployment
          .send({
            from,
            gas: gasEstimate.toString()
          })
          .on('transactionHash', (hash) => {
            resolve({ contract, transactionHash: hash.toString() });
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

    return web3.eth
      .getTransactionReceipt(txnHash)
      .then(async (receipt: TransactionReceipt) => {
        const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
          dlFactoryContract.getAbi() as AbiItem[],
          receipt.contractAddress
        );
        return contract.methods['getDocumentData']()
          .call()
          .then((res: void | [] | DocumentDataObjectResponse) => {
            if (!this.isDocumentDataResponseValid(res)) {
              return Promise.reject('Invalid bid response');
            }

            return {
              conctractAddress: receipt.contractAddress,
              documentName: res[0],
              ownerName: res[1],
              price: Number(res[2]),
              ownerAddress: res[3],
              accessAddress: res[4]
            } as IDocumentLockerResponse;
          })
          .catch((error: string) => Promise.reject(error));
      })
      .catch(() => Promise.reject({ message: 'not_found' }));
  }

  async unlockFile(
    w: WalletProvider,
    from: string,
    amount: number,
    contractAddress: string
  ): Promise<IReceiptTransaction> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const dlFactoryContract = new DocumentLockerContract();
    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      dlFactoryContract.getAbi() as AbiItem[],
      contractAddress
    );
    const amountInWei: string = web3.utils.toWei(String(amount), 'ether');

    try {
      const gas: bigint = await contract.methods['unlockFile']().estimateGas({ from, value: amountInWei });
      const receipt = await contract.methods['unlockFile']().send({ from, value: amountInWei, gas: gas.toString() });

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

  async getFullDocumentData(
    w: WalletProvider,
    conctractAddress: string,
    from: string
  ): Promise<IDocumentLockerResponse> {
    const web3: Web3 = this.web3ProviderService.getWeb3Provider(w) as Web3;
    const dlFactoryContract = new DocumentLockerContract();

    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      dlFactoryContract.getAbi() as AbiItem[],
      conctractAddress
    );
    return contract.methods['getFullDocumentData']()
      .call({ from })
      .then((res: void | [] | FullDocumentDataObjectResponse) => {
        if (!this.isFullDocumentDataObjectResponseResponseValid(res)) {
          return Promise.reject('Invalid bid response');
        }

        return {
          conctractAddress: conctractAddress,
          documentName: res[0],
          ownerName: res[1],
          price: Number(res[2]),
          desc: res[3],
          ownerAddress: res[4],
          accessAddress: res[5]
        } as IDocumentLockerResponse;
      })
      .catch((error: string) => Promise.reject(error));
  }
}
