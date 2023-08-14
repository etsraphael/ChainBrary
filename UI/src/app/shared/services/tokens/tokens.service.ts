import { Injectable } from '@angular/core';
import { tokenList } from '../../data/tokenList';
import { IToken } from '../../interfaces';
import Web3 from 'web3';
import { NetworkChainId } from '@chainbrary/web3-login';
import { ERC20TokenContract, TransactionTokenBridgeContract } from '../../contracts';

@Injectable({
  providedIn: 'root'
})
export class TokensService {

  getTokensListed(): IToken[] {
    return tokenList;
  }

  // TODO: To remove
  async getContractAllowance(tokenAddress: string, amount: number, chainId: NetworkChainId): Promise<boolean> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new TransactionTokenBridgeContract(chainId);

    if (!transactionContract.getAddress()) {
      return Promise.reject('Network not supported');
    }

    const contract = new web3.eth.Contract(transactionContract.getAbi(), transactionContract.getAddress());

    return contract.methods
    .canTransfer(transactionContract.getAddress(), String(amount), tokenAddress).call()
    .catch(() => Promise.reject('Network not supported'));

  }

  // TODO: Use "allowance" from a ERC20FixedSupply contract
  async getAllowance(tokenAddress: string, chainId: NetworkChainId): Promise<number> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new ERC20TokenContract(chainId, tokenAddress);
    const contract = new web3.eth.Contract(transactionContract.getAbi(), transactionContract.getAddress());

    return contract.methods
    .allowance('0xbA3Fc0648186a79baEF8DCeE9e055873F432a351', '0xF9647bbb9699849506D722e3Dc090a18d3a319A0').call()
    .catch(() => Promise.reject('Network not supported'));
  }

  // TODO: Use increaseAllowance from a ERC20FixedSupply contract

  // TODO: Use "balanceOf" from a ERC20FixedSupply contract

  // TODO: Use "transfer" from a ERC20FixedSupply contract

  // TODO: Use "approve" from a ERC20FixedSupply contract

}
