import { Injectable } from '@angular/core';
import {
  Erc20Service,
  IAllowancePayload,
  IBalancePayload,
  IEditAllowancePayload,
  ITransferPayload
} from '@chainbrary/token-bridge';
import { NetworkChainId } from '@chainbrary/web3-login';
import Web3 from 'web3';
import { TransactionTokenBridgeContract } from '../../contracts';
import { tokenList } from '../../data/tokenList';
import { IToken, SendTransactionTokenBridgePayload } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class TokensService {
  constructor(private erc20Service: Erc20Service) {}

  getTokensListed(): IToken[] {
    return tokenList;
  }

  getBalanceOfAddress(payload: IBalancePayload): Promise<number> {
    return this.erc20Service.getBalance(payload);
  }

  getAllowance(payload: IAllowancePayload): Promise<number> {
    return this.erc20Service.getAllowance(payload);
  }

  increaseAllowance(payload: IEditAllowancePayload): Promise<boolean> {
    return this.erc20Service.increaseAllowance(payload);
  }

  decreaseAllowance(payload: IEditAllowancePayload): Promise<boolean> {
    return this.erc20Service.decreaseAllowance(payload);
  }

  transfer(payload: ITransferPayload): Promise<boolean> {
    return this.erc20Service.transfer(payload);
  }

  approve(payload: IEditAllowancePayload): Promise<boolean> {
    return this.erc20Service.approve(payload);
  }

  // TODO: convert the arguments to an object
  async getTransferAvailable(
    ownerAdress: string,
    tokenAddress: string,
    amount: number,
    chainId: NetworkChainId
  ): Promise<boolean> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new TransactionTokenBridgeContract(chainId);

    if (!transactionContract.getAddress()) {
      return Promise.reject('Network not supported');
    }

    const contract = new web3.eth.Contract(transactionContract.getAbi(), transactionContract.getAddress());

    return contract.methods
      .canTransfer(ownerAdress, web3.utils.toWei(String(amount), 'ether'), tokenAddress)
      .call()
      .catch(() => Promise.reject('Network not supported'));
  }

  async transferToken(payload: SendTransactionTokenBridgePayload): Promise<boolean> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new TransactionTokenBridgeContract(payload.chainId);

    if (!transactionContract.getAddress()) {
      return Promise.reject('Network not supported');
    }

    const contract = new web3.eth.Contract(transactionContract.getAbi(), transactionContract.getAddress());

    return contract.methods
      .transfer(web3.utils.toWei(String(payload.amount), 'ether'), payload.destinationAddress, payload.tokenAddress)
      .send({ from: payload.ownerAdress })
      .catch(() => Promise.reject('Network not supported'));
  }
}
