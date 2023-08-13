import { Injectable } from '@angular/core';
import { tokenList } from '../../data/tokenList';
import { IToken } from '../../interfaces';
import Web3 from 'web3';
import { TransactionTokenBridgeContract } from '../../contracts/transactionTokenBridgeContract';
import { NetworkChainId } from '@chainbrary/web3-login';

@Injectable({
  providedIn: 'root'
})
export class TokensService {
  getTokensListed(): IToken[] {
    return tokenList;
  }

  async getContractAllowance(contractAddress: string, chainId: NetworkChainId): Promise<number> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new TransactionTokenBridgeContract(chainId);

    if (!transactionContract.getAddress()) {
      return Promise.reject('Network not supported');
    }

    const contract = new web3.eth.Contract(transactionContract.getAbi(), transactionContract.getAddress());

    // TODO: Fix this
    return contract.methods
    .canTransfer(transactionContract.getAddress(), '1000', '0x346E49e1ad08Ee850a855A4Dd851DEa8dF82589d').call()
    .then((result: any) => {
      console.log(result);
      return 10;
    })
    .catch((err: any) => {
      console.log(err)
      return Promise.reject('Network not supported')
    });

  }
}
