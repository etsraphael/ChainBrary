import { Injectable } from '@angular/core';
import { NetworkChainId } from '@chainbrary/web3-login';
import Web3, { AbiFragment, AbiItem, Contract, Log, TransactionReceipt } from 'web3';
import {
  CustomERC20TokenContract,
  CustomERC20TokenFactoryContract,
  CustomERC20TokenFactoryObjectResponse,
  ERC20TokenContract
} from '../../contracts';
import { IReceiptTransaction, ITokenCreationPayload, ITokenSetup } from '../../interfaces';
import { Web3ProviderService } from '../web3-provider/web3-provider.service';
import { IBalancePayload } from '@chainbrary/token-bridge';

@Injectable({
  providedIn: 'root'
})
export class TokenSetupService {
  constructor(private web3ProviderService: Web3ProviderService) {}

  async getBalance(payload: IBalancePayload): Promise<number> {
    const rpcUrl = this.web3ProviderService.getRpcUrl(payload.chainId as NetworkChainId, false);
    const web3: Web3 = new Web3(rpcUrl);
    const transactionContract = new ERC20TokenContract(payload.chainId, payload.tokenAddress);
    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      transactionContract.getAbi(),
      transactionContract.getAddress()
    );
    const balance: bigint = await contract.methods['balanceOf'](payload.owner).call();

    // Assume the balance is in Wei and you want to convert it to Ether
    const balanceBigInt = BigInt(balance.toString());
    const decimals = 18; // For Ether, the decimal places are 18
    const divisor = BigInt(10 ** decimals);

    // Convert balance from Wei to Ether
    const balanceInEther = Number(balanceBigInt) / Number(divisor);

    return balanceInEther;
  }

  private isCustomERC20TokenResponseValid(res: unknown): res is CustomERC20TokenFactoryObjectResponse {
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
    token: ITokenCreationPayload,
    chainId: NetworkChainId,
    amountInWei: string
  ): Promise<string> {
    const rpcUrl = this.web3ProviderService.getRpcUrl(token.network, false);
    const web3: Web3 = new Web3(rpcUrl);
    const tokenFactoryContract = new CustomERC20TokenFactoryContract(chainId);
    const contract: Contract<AbiFragment[]> = new web3.eth.Contract(
      tokenFactoryContract.getAbi() as AbiItem[],
      tokenFactoryContract.getAddress()
    );

    try {
      const gasEstimate: bigint = await contract.methods['createToken'](
        from,
        token.name,
        token.symbol,
        token.maxSupply,
        token.canMint,
        token.canBurn,
        token.canPause,
        [],
        [],
        amountInWei
      ).estimateGas({ from, value: amountInWei });

      return new Promise((resolve, reject) => {
        contract.methods['createToken'](
          from,
          token.name,
          token.symbol,
          token.maxSupply,
          token.canMint,
          token.canBurn,
          token.canPause,
          [],
          [],
          amountInWei
        )
          .send({ from, gas: String(gasEstimate), value: amountInWei })
          .on('transactionHash', (hash) => {
            resolve(String(hash));
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
    const tokenFactoryContract = new CustomERC20TokenFactoryContract(chainId);

    return web3.eth.getTransactionReceipt(txnHash).then(async (receipt: TransactionReceipt) => {
      const eventLogs = receipt.logs.filter(
        (log: Log) => log?.address?.toLowerCase() === tokenFactoryContract.getAddress().toLowerCase()
      );
      if (eventLogs.length === 0) {
        return Promise.reject('No event logs found for the specified transaction hash');
      }

      if (eventLogs[0].data) {
        const tokenAddress: string = web3.eth.abi.decodeParameter('address', String(eventLogs[0].data)) as string;
        const contract = new web3.eth.Contract(customERC20TokenContract.getAbi() as AbiItem[], tokenAddress);

        return contract.methods['getTokenDetails']()
          .call()
          .then((res: void | [] | CustomERC20TokenFactoryObjectResponse) => {
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
              contractAddress: tokenAddress,
              chainId: chainId
            } as ITokenSetup;
          })
          .catch((error: string) => Promise.reject(error));
      } else {
        return Promise.reject('No data found in the event logs');
      }
    });
  }

  async mintToken(
    from: string,
    to: string,
    amount: number,
    contractAddress: string,
    chainId: NetworkChainId
  ): Promise<IReceiptTransaction> {
    const rpcUrl = this.web3ProviderService.getRpcUrl(chainId, false);
    const web3: Web3 = new Web3(rpcUrl);

    const customERC20TokenContract = new CustomERC20TokenContract();
    const contract = new web3.eth.Contract(customERC20TokenContract.getAbi() as AbiItem[], contractAddress);
    const amountInWei: string = web3.utils.toWei(String(amount), 'ether');

    try {
      // Estimate gas and mint the token
      const gas: bigint = await contract.methods['mint'](to, amountInWei).estimateGas({ from });
      const receipt = await contract.methods['mint'](to, amountInWei).send({ from, gas: gas.toString() });

      const convertedReceipt: IReceiptTransaction = {
        blockHash: receipt.blockHash,
        blockNumber: Number(receipt.blockNumber),
        contractAddress: contractAddress,
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
      return Promise.reject((error as Error)?.message || error);
    }
  }

  async burnToken(
    from: string,
    amount: number,
    contractAddress: string,
    chainId: NetworkChainId
  ): Promise<IReceiptTransaction> {
    const rpcUrl = this.web3ProviderService.getRpcUrl(chainId, false);
    const web3: Web3 = new Web3(rpcUrl);

    const customERC20TokenContract = new CustomERC20TokenContract();
    const contract = new web3.eth.Contract(customERC20TokenContract.getAbi() as AbiItem[], contractAddress);
    const amountInWei: string = web3.utils.toWei(String(amount), 'ether');

    try {
      // Estimate gas and burn the token
      const gas: bigint = await contract.methods['burn'](amountInWei).estimateGas({ from });
      const receipt = await contract.methods['burn'](amountInWei).send({ from, gas: gas.toString() });

      const convertedReceipt: IReceiptTransaction = {
        blockHash: receipt.blockHash,
        blockNumber: Number(receipt.blockNumber),
        contractAddress: contractAddress,
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
      return Promise.reject((error as Error)?.message || error);
    }
  }

  async pauseToken(from: string, contractAddress: string, chainId: NetworkChainId): Promise<IReceiptTransaction> {
    const rpcUrl = this.web3ProviderService.getRpcUrl(chainId, false);
    const web3: Web3 = new Web3(rpcUrl);

    const customERC20TokenContract = new CustomERC20TokenContract();
    const contract = new web3.eth.Contract(customERC20TokenContract.getAbi() as AbiItem[], contractAddress);

    try {
      // Estimate gas and pause the token
      const gas: bigint = await contract.methods['pause']().estimateGas({ from });
      const receipt = await contract.methods['pause']().send({ from, gas: gas.toString() });

      const convertedReceipt: IReceiptTransaction = {
        blockHash: receipt.blockHash,
        blockNumber: Number(receipt.blockNumber),
        contractAddress: contractAddress,
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
      return Promise.reject((error as Error)?.message || error);
    }
  }

  async transferToken(
    from: string,
    to: string,
    amount: number,
    contractAddress: string,
    chainId: NetworkChainId
  ): Promise<IReceiptTransaction> {
    const rpcUrl = this.web3ProviderService.getRpcUrl(chainId, false);
    const web3: Web3 = new Web3(rpcUrl);

    const customERC20TokenContract = new CustomERC20TokenContract();
    const contract = new web3.eth.Contract(customERC20TokenContract.getAbi() as AbiItem[], contractAddress);
    const amountInWei: string = web3.utils.toWei(String(amount), 'ether');

    try {
      // Estimate gas and transfer the token
      const gas: bigint = await contract.methods['transfer'](to, amountInWei).estimateGas({ from });
      const receipt = await contract.methods['transfer'](to, amountInWei).send({ from, gas: gas.toString() });

      const convertedReceipt: IReceiptTransaction = {
        blockHash: receipt.blockHash,
        blockNumber: Number(receipt.blockNumber),
        contractAddress: contractAddress,
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
      return Promise.reject((error as Error)?.message || error);
    }
  }

}
