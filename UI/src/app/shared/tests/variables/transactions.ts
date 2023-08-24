import { ITransactionLog, TransactionOptions, TransactionRole } from "@chainbrary/transaction-search";
import { ITransactionCard } from "../../interfaces";
import { NetworkChainId } from "@chainbrary/web3-login";
import Web3 from "web3";

export const transactionLogMock: ITransactionLog = {
  role: TransactionRole.Receiver,
  transaction: {
    hash: '0x1234567890abcdef',
    nonce: 1,
    blockHash: null,
    blockNumber: null,
    transactionIndex: null,
    from: '0xabcdef1234567890',
    to: null,
    value: '1000000000000000000',
    gasPrice: '20000000000',
    gas: 21000,
    input: '0x',
  },
  block: {
    transactions: [],
    size: 100,
    difficulty: 123456789,
    totalDifficulty: 987654321,
    uncles: ['0xabcdef1234567890', '0x1234567890abcdef'],
    number: 12345,
    hash: '0x1234567890abcdef',
    parentHash: '0xabcdef1234567890',
    nonce: '0xabcdef1234567890',
    sha3Uncles: '0xabcdef1234567890',
    logsBloom: '0xabcdef1234567890',
    transactionsRoot: '0xabcdef1234567890',
    stateRoot: '0xabcdef1234567890',
    receiptsRoot: '0xabcdef1234567890',
    miner: '0xabcdef1234567890',
    extraData: '0xabcdef1234567890',
    gasLimit: 1000000,
    gasUsed: 500000,
    timestamp: 1630441200,
    baseFeePerGas: 100,
  },
  submittedDate: new Date(),
  amount: 2500
}

export const transactionCardMock: ITransactionCard = {
  title: "Transaction",
  type: 'success',
  hash: "0x1a2b3c4d5e6f7g8h9",
  component: "TransactionComponent",
  chainId: NetworkChainId.ETHEREUM,
}

export const transactionOptionsMock: TransactionOptions = {
  web3: {
    eth: {
      getBlockNumber: () => Promise.resolve(1000)
    },
    utils: {
      sha3: (value: string) => value,
      padLeft: (value: string | number, characterAmount: number, sign?: string) => {
        const stringValue = String(value);
        const paddedValue = sign ? sign + stringValue.padStart(characterAmount - 1, '0') : stringValue.padStart(characterAmount, '0');
        return paddedValue;
      },
    },
  } as Web3,
  pagination: {
    page: 1,
    limit: 10,
  },
  address: {
    smartContractAddress: '0x1234567890abcdef',
    accountAddress: '0xabcdef1234567890',
  }
}
