export interface IReceiptTransaction {
  blockHash: string;
  blockNumber: number;
  contractAddress: null | string;
  cumulativeGasUsed: number;
  effectiveGasPrice: number;
  from: string;
  gasUsed: number;
  logsBloom: string;
  status: bigint;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: bigint | undefined;
}
