import { Injectable } from '@angular/core';
import { NetworkChainId } from '@chainbrary/web3-login';
import Web3, { AbiFragment, AbiItem, Contract, FMT_NUMBER, NumberTypes, TransactionReceipt } from 'web3';
import { CustomERC20TokenContract, CustomERC20TokenObjectResponse } from '../../contracts/customERC20TokenContract';
import { ITokenCreationPayload, ITokenSetup } from '../../interfaces';
import { Web3ProviderService } from '../web3-provider/web3-provider.service';

@Injectable({
  providedIn: 'root'
})
export class TokenSetupService {
  constructor(private web3ProviderService: Web3ProviderService) {}

  private isCustomERC20TokenResponseValid(res: unknown): res is CustomERC20TokenObjectResponse {
    if (typeof res !== 'object' || res === null) {
      return false;
    }

    const obj = res as { [key: string]: unknown };

    return (
      typeof obj[0] === 'string' &&
      typeof obj[1] === 'string' &&
      typeof obj[2] === 'bigint' &&
      typeof obj[3] === 'bigint' &&
      typeof obj[4] === 'boolean' &&
      typeof obj[5] === 'boolean' &&
      typeof obj[6] === 'boolean' &&
      typeof obj[7] === 'string' &&
      typeof obj['__length__'] === 'number'
    );
  }

  async deployCustomERC20TokenContract(
    from: string,
    token: ITokenCreationPayload
  ): Promise<{ contract: Contract<AbiFragment[]>; transactionHash: string }> {
    const rpcUrl = this.web3ProviderService.getRpcUrl(token.network, false);
    const web3: Web3 = new Web3(rpcUrl);

    const tokenFactoryContract = new CustomERC20TokenContract();
    const contractData = {
      data: tokenFactoryContract.getByteCode(),
      arguments: [from, token.name, token.symbol, token.maxSupply, token.canMint, token.canBurn, token.canPause, [], []]
    };

    const contract = new web3.eth.Contract(tokenFactoryContract.getAbi() as AbiItem[]);

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

  async getCustomERC20FromTxnHash(chainId: NetworkChainId, txnHash: string): Promise<ITokenSetup> {
    const rpcUrl = this.web3ProviderService.getRpcUrl(chainId, false);
    const web3: Web3 = new Web3(rpcUrl);
    const customERC20TokenContract = new CustomERC20TokenContract();

    return web3.eth.getTransactionReceipt(txnHash).then(async (receipt: TransactionReceipt) => {
      const contract = new web3.eth.Contract(customERC20TokenContract.getAbi() as AbiItem[], receipt.contractAddress);
      return contract.methods['getTokenDetails']()
        .call()
        .then((res: void | [] | CustomERC20TokenObjectResponse) => {
          if (!this.isCustomERC20TokenResponseValid(res)) {
            return Promise.reject('Invalid token response');
          }

          return {
            name: res[0],
            symbol: res[1],
            totalSupply: Number(web3.utils.fromWei(String(res[2]), 'ether')),
            decimals: Number(web3.utils.fromWei(String(res[3]), 'ether')),
            canMint: res[4],
            canBurn: res[5],
            canPause: res[6],
            owner: res[7],
            contractAddress: receipt.contractAddress
          } as ITokenSetup;
        })
        .catch((error: string) => Promise.reject(error));
    });
  }
}
