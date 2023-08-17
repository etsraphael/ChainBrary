import Web3 from 'web3';
import { Injectable } from '@angular/core';
import { ERC20TokenContract } from '../../contracts';

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
  async getBalance(tokenAddress: string, chainId: string, userAccountAddress: string): Promise<number> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new ERC20TokenContract(chainId, tokenAddress);
    const contract = new web3.eth.Contract(transactionContract.getAbi(), transactionContract.getAddress());
    return contract.methods.balanceOf(userAccountAddress).call();
  }
}
