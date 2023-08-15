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

  async getAllowance(tokenAddress: string, chainId: NetworkChainId, userAccountAddress: string): Promise<number> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new ERC20TokenContract(chainId, tokenAddress);
    const contract = new web3.eth.Contract(transactionContract.getAbi(), transactionContract.getAddress());
    return contract.methods
      .allowance(userAccountAddress, transactionContract.getBridgeAddress())
      .call()
      .catch(() => Promise.reject('Network not supported'));
  }

  async getBalanceOfAddress(
    tokenAddress: string,
    chainId: NetworkChainId,
    userAccountAddress: string
  ): Promise<number> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new ERC20TokenContract(chainId, tokenAddress);
    const contract = new web3.eth.Contract(transactionContract.getAbi(), transactionContract.getAddress());
    return contract.methods
      .balanceOf(userAccountAddress)
      .call()
      .catch(() => Promise.reject('Network not supported'));
  }

  async increaseAllowance(
    tokenAddress: string,
    amount: number,
    chainId: NetworkChainId,
    userAccountAddress: string
  ): Promise<boolean> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new ERC20TokenContract(chainId, tokenAddress);
    const contract = new web3.eth.Contract(transactionContract.getAbi(), transactionContract.getAddress());

    return contract.methods
      .increaseAllowance(transactionContract.getBridgeAddress(), String(amount))
      .estimateGas({ from: userAccountAddress })
      .then((gas: number) =>
        contract.methods
          .increaseAllowance(transactionContract.getBridgeAddress(), String(amount))
          .send({ from: userAccountAddress, gas })
      )
      .catch(() => Promise.reject('Network not supported'));
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
      .canTransfer(transactionContract.getAddress(), String(amount), tokenAddress)
      .call()
      .catch(() => Promise.reject('Network not supported'));
  }

  // TODO: Use "transfer" from a ERC20FixedSupply contract

  // TODO: Use "approve" from a ERC20FixedSupply contract
}
