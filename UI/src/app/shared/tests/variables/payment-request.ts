import { NetworkChainId } from "@chainbrary/web3-login";
import { IPaymentRequestState } from "src/app/store/payment-request-store/state/interfaces";
import { ethereumNetworkMock } from "./network-detail";
import { ethereumTokenMock } from "./token";

export const paymentRequestMock: IPaymentRequestState = {
  payment: {
    data: {
      chainId: NetworkChainId.ETHEREUM,
      tokenId: "0xabcdef1234567890",
      publicAddress: "0x1234567890abcdef",
      username: "JohnDoe",
      amount: 1000,
      description: "This is a fake description.",
      avatarUrl: "https://example.com/avatar.png",
      usdEnabled: true,
    },
    loading: false,
    error: null
  },
  profile: {
    publicAddress: "0x1234567890abcdef",
    avatarUrl: "https://example.com/avatar.png",
    username: "JohnDoe",
  },
  network: ethereumNetworkMock,
  conversion: {
    data: {
      usdAmount: 1000,
      tokenAmount: 1000,
      priceInUsdEnabled: true,
    },
    loading: false,
    error: null
  },
  smartContractCanTransfer: {
    data: false,
    loading: false,
    error: null
  },
  token: ethereumTokenMock
}
