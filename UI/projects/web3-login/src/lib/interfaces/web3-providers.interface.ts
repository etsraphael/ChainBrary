import { INetworkDetail } from './network.interface';

export enum WalletProvider {
  METAMASK = 'metamask'
}

export interface Web3Provider {
  key: WalletProvider.METAMASK;
  name: string;
  iconUrl: string;
  backgroundColorGradient: {
    start: string;
    end: string;
    orientation: {
      start: [number, number];
      end: [number, number];
    };
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
      orientation: {
        start: [0, 0],
        end: [0, 1]
      }
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
