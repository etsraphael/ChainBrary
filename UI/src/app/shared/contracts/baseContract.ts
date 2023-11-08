import { AbiItem } from 'web3-utils';

export abstract class BaseContract {
  abstract getAddress(): string;
  abstract getAbi(): AbiItem[];
}

export abstract class BaseContractFactory {
  abstract getAbi(): AbiItem[];
}
