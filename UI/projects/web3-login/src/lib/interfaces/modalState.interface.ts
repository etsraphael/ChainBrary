// TODO: remove IModalState and ModalStateType
export interface IModalState {
  type: ModalStateType;
  message?: string;
  data?: {
    publicAddress: string;
    network: INetworkDetail | null;
  };
}

export interface INetworkDetail {
  chainId: NetworkChainId;
  chainCode: NetworkChainCode;
  name: string;
  shortName: string;
  nativeCurrency: {
    id: TokenId;
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string;
  rpcUrls?: string[];
}

export enum ModalStateType {
  SUCCESS = 'success',
  ERROR = 'error',
  CANCEL = 'cancel',
  LOADING = 'loading'
}

export enum NetworkChainId {
  ETHEREUM = '1',
  BNB = '56',
  SEPOLIA = '11155111',
  ARBITRUM = '42161',
  POLYGON = '137',
  OPTIMISM = '10',
  AVALANCHE = '43114',
  MOONBEAM = '1284',
  KAVA = '222',
  FANTOM = '250',
  CELO = '42220',
  UNKNOWN = '0'
}

export enum TokenId {
  ETHEREUM = 'ethereum0',
  BNB = 'binance-smart-chain0',
  SEPOLIA = 'sepolia0',
  ARBITRUM = 'arbitrum0',
  MATIC = 'matic0',
  AVALANCHE = 'avalanche0',
  MOONBEAM = 'moonbeam0',
  KAVA = 'kava0',
  FANTOM = 'fantom0',
  CELO = 'celo0',
  UNKNOWN = 'unknown0'
}

export enum NetworkChainCode {
  ETHEREUM = '0x1',
  BNB = '0x38',
  SEPOLIA = '0xaa36a7',
  ARBITRUM = '0xa4b1',
  POLYGON = '0x89',
  OPTIMISM = '0xa',
  AVALANCHE = '0xa86a',
  MOONBEAM = '0x504',
  KAVA = '0x8ae',
  FANTOM = '0xfa',
  CELO = '0xa4ec',
  UNKNOWN = '0'
}

export interface NetworkRpcUrlSupported {
  chainId: NetworkChainId;
  rpcUrl: string[];
}

export interface Web3LoginConfig {
  networkSupported: NetworkRpcUrlSupported[];
}
