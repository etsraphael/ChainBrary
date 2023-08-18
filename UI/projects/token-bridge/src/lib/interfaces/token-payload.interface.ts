export interface IBalancePayload {
  tokenAddress: string;
  chainId: string;
  owner: string;
}

export interface IAllowancePayload {
  tokenAddress: string;
  chainId: string;
  owner: string;
  spender: string;
}

export interface IEditAllowancePayload extends IAllowancePayload {
  amount: number;
}
