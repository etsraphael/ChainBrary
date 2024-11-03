import { IToken } from './token.interface';

export interface QuotePayload {
  from: IToken;
  to: IToken;
  amount: string;
  slippage: string;
  deadline: string;
}
