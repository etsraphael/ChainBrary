import { NetworkChainId } from "@chainbrary/web3-login";
import { IPaymentRequestState } from "src/app/store/payment-request-store/state/interfaces";
import { ethereumNetworkMock } from "./network-detail";

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
  network: ethereumNetworkMock
}
