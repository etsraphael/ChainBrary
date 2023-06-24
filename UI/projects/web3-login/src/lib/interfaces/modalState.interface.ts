export interface IModalState {
  type: ModalStateType;
  message?: string;
  data?: {
    publicAddress: string;
    network: INetworkDetail | null;
  };
}

export interface INetworkDetail {
  chainId: string;
  chainCode: string;
  name: string;
  shortName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export enum ModalStateType {
  SUCCESS = 'success',
  ERROR = 'error',
  CANCEL = 'cancel',
  LOADING = 'loading'
}
