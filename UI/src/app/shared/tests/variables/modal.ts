import { IModalState, ModalStateType } from "@chainbrary/web3-login";
import { ethereumNetworkMock } from "./network-detail";

export const modalMock: IModalState = {
  type: ModalStateType.SUCCESS,
  message: 'Opération réussie',
  data: {
    publicAddress: '0xabc123',
    network: ethereumNetworkMock,
  },
};
