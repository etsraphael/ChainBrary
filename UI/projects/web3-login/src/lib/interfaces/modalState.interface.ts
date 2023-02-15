export interface ModalState {
  type: ModalStateType;
  message?: string;
  data?: {
    publicAddress: string
  }
}

export enum ModalStateType {
  SUCCESS = 'success',
  ERROR = 'error',
  CANCEL = 'cancel',
  LOADING = 'loading'
}
