import { Injectable } from '@angular/core';
import Web3, { AbiFragment, Contract } from 'web3';
import { ERC20TokenContract } from '../../contracts';
import {
  IAllowancePayload,
  IBalancePayload,
  IEditAllowancePayload,
  ITransferPayload
} from '../../interfaces/token-payload.interface';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class Erc20Service {
  getBalance(payload: IBalancePayload): Promise<number> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new ERC20TokenContract(payload.chainId, payload.tokenAddress);
    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      transactionContract.getAbi(),
      transactionContract.getAddress()
    );
    return contract.methods['balanceOf'](payload.owner).call();
  }

  getAllowance(payload: IAllowancePayload): Promise<number> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new ERC20TokenContract(payload.chainId, payload.tokenAddress);
    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      transactionContract.getAbi(),
      transactionContract.getAddress()
    );
    return contract.methods['allowance'](payload.owner, payload.spender).call();
  }

  async increaseAllowance(payload: IEditAllowancePayload): Promise<boolean | any> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new ERC20TokenContract(payload.chainId, payload.tokenAddress);
    const contract = new web3.eth.Contract(transactionContract.getAbi(), transactionContract.getAddress());
    const amountToSend: string = web3.utils.toWei(String(payload.amount), 'ether');

    return contract.methods['increaseAllowance'](payload.spender, amountToSend)
      .estimateGas({ from: payload.owner })
      .then((gas: bigint) =>
        contract.methods['increaseAllowance'](payload.spender, amountToSend).send({
          from: payload.owner,
          gas: gas.toString()
        })
      );
  }

  async decreaseAllowance(payload: IEditAllowancePayload): Promise<boolean | any> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new ERC20TokenContract(payload.chainId, payload.tokenAddress);
    const contract = new web3.eth.Contract(transactionContract.getAbi(), transactionContract.getAddress());
    const amountToSend: string = web3.utils.toWei(String(payload.amount), 'ether');

    return contract.methods['decreaseAllowance'](payload.spender, amountToSend)
      .estimateGas({ from: payload.owner })
      .then((gas: bigint) =>
        contract.methods['decreaseAllowance'](payload.spender, amountToSend).send({
          from: payload.owner,
          gas: gas.toString()
        })
      );
  }

  async transfer(payload: ITransferPayload): Promise<boolean | any> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new ERC20TokenContract(payload.chainId, payload.tokenAddress);
    const contract = new web3.eth.Contract(transactionContract.getAbi(), transactionContract.getAddress());
    const amountToSend: string = web3.utils.toWei(String(payload.amount), 'ether');

    return contract.methods['transfer'](payload.to, amountToSend)
      .estimateGas({ from: payload.from })
      .then((gas: bigint) =>
        contract.methods['transfer'](payload.to, amountToSend).send({ from: payload.from, gas: gas.toString() })
      );
  }

  async approve(payload: IEditAllowancePayload): Promise<boolean | any> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new ERC20TokenContract(payload.chainId, payload.tokenAddress);
    const contract = new web3.eth.Contract(transactionContract.getAbi(), transactionContract.getAddress());
    const amountToSend: string = web3.utils.toWei(String(payload.amount), 'ether');

    return contract.methods['approve'](payload.spender, amountToSend)
      .estimateGas({ from: payload.owner })
      .then((gas: bigint) =>
        contract.methods['approve'](payload.spender, amountToSend).send({ from: payload.owner, gas: gas.toString() })
      );
  }
}
