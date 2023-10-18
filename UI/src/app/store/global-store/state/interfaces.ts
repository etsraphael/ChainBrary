import { WalletProvider } from '@chainbrary/web3-login';

export const GLOBAL_FEATURE_KEY = 'global';

export interface IGlobalState {
  theme: string;
  walletConnected: WalletProvider | null;
}

export interface GlobalState {
  readonly [GLOBAL_FEATURE_KEY]: IGlobalState;
}
