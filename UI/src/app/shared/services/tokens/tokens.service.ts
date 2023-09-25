import { Injectable } from '@angular/core';
import {
  Erc20Service,
  IAllowancePayload,
  IBalancePayload,
  IEditAllowancePayload,
  ITransferPayload
} from '@chainbrary/token-bridge';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { TransactionBridgeContract, TransactionTokenBridgeContract } from '../../contracts';
import { tokenList } from '../../data/tokenList';
import {
  IReceiptTransaction,
  IToken,
  SendNativeTokenToMultiSigPayload,
  SendTransactionTokenBridgePayload,
  TransactionTokenBridgePayload
} from '../../interfaces';

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

  async getTransferAvailable(payload: TransactionTokenBridgePayload): Promise<boolean> {
    try {
      const web3: Web3 = new Web3(window.ethereum);
      const transactionContract = new TransactionTokenBridgeContract(payload.chainId);

      const address = transactionContract.getAddress();
      if (!address) {
        throw new Error('Network not supported');
      }

      const contract = new web3.eth.Contract(transactionContract.getAbi(), address);

      return await contract.methods
        .canTransfer(payload.ownerAdress, web3.utils.toWei(String(payload.amount), 'ether'), payload.tokenAddress)
        .call();
    } catch (error) {
      return Promise.reject('Network not supported yet');
    }
  }

  async transferNonNativeToken(payload: SendTransactionTokenBridgePayload): Promise<IReceiptTransaction> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new TransactionTokenBridgeContract(payload.chainId);

    if (!transactionContract.getAddress()) {
      return Promise.reject('Network not supported');
    }

    const contract = new web3.eth.Contract(transactionContract.getAbi(), transactionContract.getAddress());

    try {
      const gas = await contract.methods
        .transfer(web3.utils.toWei(String(payload.amount), 'ether'), payload.destinationAddress, payload.tokenAddress)
        .estimateGas({ from: payload.ownerAdress });

      return contract.methods
        .transfer(web3.utils.toWei(String(payload.amount), 'ether'), payload.destinationAddress, payload.tokenAddress)
        .send({ from: payload.ownerAdress, gas: gas });
    } catch (error) {
      return Promise.reject((error as Error)?.message || error);
    }
  }

  async transferNativeToken(payload: SendNativeTokenToMultiSigPayload): Promise<IReceiptTransaction> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new TransactionBridgeContract(String(payload.chainId));
    const contract: Contract = new web3.eth.Contract(transactionContract.getAbi(), transactionContract.getAddress());

    try {
      const gas = await contract.methods
        .transferFund(payload.addresses)
        .estimateGas({ from: payload.from, value: String(payload.amount) });

      return contract.methods
        .transferFund(payload.addresses)
        .send({ from: payload.from, value: String(payload.amount), gas: gas });
    } catch (error) {
      return Promise.reject((error as { message: string; code: number }) || error);
    }
  }
}
