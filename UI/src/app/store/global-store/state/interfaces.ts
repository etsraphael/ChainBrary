import Web3 from 'web3';

export const GLOBAL_FEATURE_KEY = 'global';

export interface IGlobalState {
  theme: string;
  web3Provier: Web3;
}

export interface GlobalState {
  readonly [GLOBAL_FEATURE_KEY]: IGlobalState;
}
