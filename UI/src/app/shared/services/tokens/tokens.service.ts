import { Injectable } from '@angular/core';
import {
  Erc20Service,
  IAllowancePayload,
  IBalancePayload,
  IEditAllowancePayload,
  ITransferPayload
} from '@chainbrary/token-bridge';
import { NetworkChainId } from '@chainbrary/web3-login';
import BigNumber from 'bignumber.js';
import Web3, { AbiFragment, Contract, TransactionReceipt } from 'web3';
import { AbiItem } from 'web3-utils';
import { ERC20TokenContract, TransactionBridgeContract } from '../../contracts';
import { tokenList } from '../../data/tokenList';
import {
  BalanceAndAllowance,
  IBalanceAndAllowancePayload,
  IReceiptTransaction,
  IToken,
  SendNativeTokenPayload,
  SendTransactionTokenBridgePayload,
  TransactionTokenBridgePayload
} from '../../interfaces';
import { WalletService } from '../wallet/wallet.service';
import { Web3ProviderService } from '../web3-provider/web3-provider.service';

@Injectable({
  providedIn: 'root'
})
export class TokensService {
  constructor(
    private erc20Service: Erc20Service,
    private walletService: WalletService,
    private web3ProviderService: Web3ProviderService
  ) {}

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
      const transactionContract = new TransactionBridgeContract(payload.chainId);

      const address = transactionContract.getAddress();
      if (!address) {
        throw new Error('Network not supported');
      }

      const contract = new web3.eth.Contract(transactionContract.getAbi() as AbiItem[], address);

      return await contract.methods['canTransferToken'](
        payload.ownerAdress,
        web3.utils.toWei(new BigNumber(payload.amount).toString(10), 'ether'),
        payload.tokenAddress
      ).call();
    } catch (error) {
      return Promise.reject(this.walletService.formatErrorMessage(error));
    }
  }

  async transferNonNativeTokenSC(payload: SendTransactionTokenBridgePayload): Promise<IReceiptTransaction> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new TransactionBridgeContract(payload.chainId);

    if (!transactionContract.getAddress()) {
      return Promise.reject('Network not supported');
    }

    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      transactionContract.getAbi() as AbiItem[],
      transactionContract.getAddress()
    );

    try {
      const gas = await contract.methods['transferTokenFund'](
        web3.utils.toWei(new BigNumber(payload.amount).toString(10), 'ether'),
        payload.destinationAddress,
        payload.tokenAddress
      ).estimateGas({ from: payload.ownerAdress });

      const receipt = await contract.methods['transferTokenFund'](
        web3.utils.toWei(new BigNumber(payload.amount).toString(10), 'ether'),
        payload.destinationAddress,
        payload.tokenAddress
      ).send({ from: payload.ownerAdress, gas: gas.toString() });

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
      return Promise.reject(this.walletService.formatErrorMessage(error));
    }
  }

  async transferNativeTokenSC(payload: SendNativeTokenPayload): Promise<IReceiptTransaction> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new TransactionBridgeContract(String(payload.chainId));
    const contract = new web3.eth.Contract(transactionContract.getAbi() as AbiItem[], transactionContract.getAddress());

    const amount = new BigNumber(payload.amount);
    const amountFormat = amount.decimalPlaces(0, BigNumber.ROUND_HALF_UP).toString(10);

    try {
      const gas: bigint = await contract.methods['transferFund'](payload.to).estimateGas({
        from: payload.from,
        value: amountFormat
      });

      const receipt = await contract.methods['transferFund'](payload.to).send({
        from: payload.from,
        value: amountFormat,
        gas: gas.toString()
      });

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
      return Promise.reject(this.walletService.formatErrorMessage(error));
    }
  }

  async transferNativeToken(payload: SendNativeTokenPayload): Promise<TransactionReceipt> {
    const web3: Web3 = new Web3(window.ethereum);
    try {
      const receipt: TransactionReceipt = await web3.eth.sendTransaction({
        from: payload.from,
        to: payload.to,
        value: new BigNumber(payload.amount).toString(10)
      });

      return receipt;
    } catch (error) {
      return Promise.reject(this.walletService.formatErrorMessage(error));
    }
  }

  async transferNonNativeToken(payload: SendTransactionTokenBridgePayload): Promise<TransactionReceipt> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new ERC20TokenContract(payload.chainId, payload.tokenAddress);
    const contract = new web3.eth.Contract(transactionContract.getAbi() as AbiItem[], transactionContract.getAddress());

    try {
      const gas = await contract.methods['transfer'](
        payload.destinationAddress,
        web3.utils.toWei(new BigNumber(payload.amount).toString(10), 'ether')
      ).estimateGas({ from: payload.ownerAdress });

      return contract.methods['transfer'](
        payload.destinationAddress,
        web3.utils.toWei(new BigNumber(payload.amount).toString(10), 'ether')
      ).send({ from: payload.ownerAdress, gas: gas.toString() });
    } catch (error) {
      return Promise.reject(this.walletService.formatErrorMessage(error));
    }
  }

  async transferNonNativeTokenForPayNow(payload: SendTransactionTokenBridgePayload): Promise<TransactionReceipt> {
    const web3: Web3 = new Web3(window.ethereum);
    const transactionContract = new ERC20TokenContract(payload.chainId, payload.tokenAddress);
    const contract = new web3.eth.Contract(transactionContract.getAbi() as AbiItem[], transactionContract.getAddress());

    try {
      const gas = await contract.methods['transfer'](
        payload.destinationAddress,
        new BigNumber(payload.amount).toString(10)
      ).estimateGas({ from: payload.ownerAdress });

      return contract.methods['transfer'](payload.destinationAddress, new BigNumber(payload.amount).toString(10)).send({
        from: payload.ownerAdress,
        gas: gas.toString()
      });
    } catch (error) {
      return Promise.reject(this.walletService.formatErrorMessage(error));
    }
  }

  async getBalanceAndAllowance(from: string, payload: IBalanceAndAllowancePayload): Promise<BalanceAndAllowance> {
    const web3: Web3 = new Web3(this.web3ProviderService.getRpcUrl(payload.chainId));
    const erc20Contract = new ERC20TokenContract(payload.chainId, payload.tokenAddress);

    const contractFragment: Contract<AbiFragment[]> = new web3.eth.Contract(
      erc20Contract.getAbi() as AbiItem[],
      erc20Contract.getAddress()
    );

    try {
      const balance = (await contractFragment.methods['balanceOf'](from).call()) as string;
      const allowance = (await contractFragment.methods['allowance'](from, payload.spender).call()) as string;

      return {
        tokenId: payload.tokenId,
        balance: web3.utils.fromWei(balance, 'ether'),
        allowance: web3.utils.fromWei(allowance, 'ether'),
        tokenIn: payload.tokenIn
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getERC20TokenByAddress(chainId: NetworkChainId, tokenAddress: string): Promise<IToken> {
    const web3: Web3 = new Web3(this.web3ProviderService.getRpcUrl(chainId));
    const erc20Contract = new ERC20TokenContract(chainId, tokenAddress);

    const contractFragment: Contract<AbiFragment[]> = new web3.eth.Contract(
      erc20Contract.getAbi() as AbiItem[],
      erc20Contract.getAddress()
    );

    try {
      const name = (await contractFragment.methods['name']().call()) as string;
      const symbol = (await contractFragment.methods['symbol']().call()) as string;

      const token: IToken = {
        tokenId: tokenAddress,
        decimals: 18,
        name,
        symbol,
        networkSupport: [{ chainId: chainId, address: tokenAddress, priceFeed: [] }]
      };

      return token;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
