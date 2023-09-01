import { FormControl, FormGroup } from '@angular/forms';
import { NetworkChainId, TokenId } from '@chainbrary/web3-login';

export interface IPaymentRequest {
  chainId: NetworkChainId;
  tokenId: TokenId | string;
  publicAddress: string;
  username: string;
  amount: number;
  usdEnabled: boolean;
  description?: string | null;
  avatarUrl?: string;
}

export interface PriceSettingsForm {
  token: FormControl<string | null>;
  description: FormControl<string | null>;
  amount: FormControl<number | null>;
  usdEnabled: FormControl<boolean | null>;
}

export interface ProfileForm {
  publicAddress: FormControl<string | null>;
  avatarUrl: FormControl<string | null>;
  username: FormControl<string | null>;
}

export interface PaymentMakerForm {
  price: FormGroup<PriceSettingsForm>;
  profile: FormGroup<ProfileForm>;
}

export interface IProfilePayment {
  publicAddress: string | null;
  avatarUrl: string | null;
  username: string | null;
}

export interface IConversionToken {
  usdAmount: number | null;
  tokenAmount: number | null;
  priceInUsdEnabled: boolean;
}

export interface TransactionTokenBridgePayload {
  ownerAdress: string;
  tokenAddress: string;
  amount: number;
  chainId: NetworkChainId;
}

export interface SendTransactionTokenBridgePayload extends TransactionTokenBridgePayload {
  destinationAddress: string;
}

export interface SendNativeTokenToMultiSigPayload {
  from: string;
  amount: number;
  chainId: NetworkChainId;
  addresses: string[];
}
