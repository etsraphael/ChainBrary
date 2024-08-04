import { INetworkDetail } from './network.interface';

export enum WalletProvider {
  METAMASK = 'metamask',
  BRAVE_WALLET = 'brave_wallet'
}

export interface Web3Provider {
  key: WalletProvider;
  name: string;
  iconUrl: string;
  backgroundColorGradient: {
    start: string;
    end: string;
    orientation: number;
  };
}

export const providerData: Web3Provider[] = [
  {
    key: WalletProvider.METAMASK,
    name: 'Metamask',
    iconUrl: './../assets/metamask.svg',
    backgroundColorGradient: {
      start: '#B16000',
      end: '#DF7900',
      orientation: 0
    }
  },
  {
    key: WalletProvider.BRAVE_WALLET,
    name: 'Brave Wallet',
    iconUrl: './../assets/brave_lion.svg',
    backgroundColorGradient: {
      start: '#FB542B',
      end: '#343546',
      orientation: -90
    }
  }
];

export interface LoginPayload {
  publicAddress: string;
  network: string;
}
export interface WalletConnectedEvent {
  publicAddress: string;
  network: INetworkDetail | null;
  walletProvider: WalletProvider;
}

export interface WalletErrorEvent {
  code: number;
  message: string;
}
