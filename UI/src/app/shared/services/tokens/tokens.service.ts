import { Injectable } from '@angular/core';
import { Erc20Service, IAllowancePayload, IBalancePayload, IEditAllowancePayload } from '@chainbrary/token-bridge';
import { NetworkChainId } from '@chainbrary/web3-login';
import Web3 from 'web3';
import { ERC20TokenContract, TransactionTokenBridgeContract } from '../../contracts';
import { tokenList } from '../../data/tokenList';
import { IContract, IToken } from '../../interfaces';
import { environment } from 'src/environments/environment';

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

  // TODO: transfer everything to a library

  async transfer(
    tokenAddress: string,
    chainId: NetworkChainId,
    userAccountAddress: string,
    transfertToAddress: string,
    amount: number
  ): Promise<boolean> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new ERC20TokenContract(chainId, tokenAddress);
    const contract = new web3.eth.Contract(transactionContract.getAbi(), transactionContract.getAddress());
    const amountToSend: string = web3.utils.toWei(String(amount), 'ether');

    return contract.methods
      .transfer(transfertToAddress, amountToSend)
      .estimateGas({ from: userAccountAddress })
      .then((gas: number) =>
        contract.methods.transfer(transfertToAddress, amountToSend).send({ from: userAccountAddress, gas })
      )
      .catch(() => Promise.reject('Network not supported'));
  }

  async approve(
    tokenAddress: string,
    chainId: NetworkChainId,
    userAccountAddress: string,
    amount: number
  ): Promise<boolean> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new ERC20TokenContract(chainId, tokenAddress);
    const contract = new web3.eth.Contract(transactionContract.getAbi(), transactionContract.getAddress());
    const amountToSend: string = web3.utils.toWei(String(amount), 'ether');

    return contract.methods
      .approve(transactionContract.getBridgeAddress(), amountToSend)
      .estimateGas({ from: userAccountAddress })
      .then((gas: number) =>
        contract.methods
          .approve(transactionContract.getBridgeAddress(), amountToSend)
          .send({ from: userAccountAddress, gas })
      )
      .catch(() => Promise.reject('Network not supported'));
  }

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
      .canTransfer(ownerAdress, String(amount), tokenAddress)
      .call()
      .catch(() => Promise.reject('Network not supported'));
  }
}
