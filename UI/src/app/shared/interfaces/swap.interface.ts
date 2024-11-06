import { NetworkChainId } from '@chainbrary/web3-login';
import { IToken } from './token.interface';

export interface QuotePayload {
  from: IToken;
  to: IToken;
  amount: string;
  slippage: string;
  deadline: string;
}

export interface SwapPayload {
  from: IToken;
  to: IToken;
  amount: string;
  slippage: string;
  deadline: string;
  recipient: string;
  chainId: NetworkChainId;
}
