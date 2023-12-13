import { AbiItem } from 'web3-utils';

export abstract class BaseContract {
  abstract getAbi(): (AbiItem | object)[];
  abstract getAddress(): string;
}

export abstract class BaseContractFactory {
  abstract getAbi(): (AbiItem | object)[];
  abstract getByteCode(): string;
}
