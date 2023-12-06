import { INetworkDetail } from '@chainbrary/web3-login';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { selectCurrentNetwork, selectPublicAddress } from '../../auth-store/state/selectors';
import { IPaymentRequest, IProfilePayment, IToken, StoreState } from './../../../shared/interfaces';
import { IPaymentRequestState, PAYMENT_REQUEST_FEATURE_KEY } from './interfaces';

export const selectPaymentRequest = createFeatureSelector<IPaymentRequestState>(PAYMENT_REQUEST_FEATURE_KEY);

export const selectPaymentRequestIsLoading: MemoizedSelector<object, boolean> = createSelector(
  selectPaymentRequest,
  (s) => s.payment.loading
);

export const selectPayment: MemoizedSelector<object, IPaymentRequest | null> = createSelector(
  selectPaymentRequest,
  (s) => s.payment.data
);

export const selectPaymentRequestError: MemoizedSelector<object, string | null> = createSelector(
  selectPaymentRequest,
  (s) => s.payment.error
);

export const selectCardIsLoading: MemoizedSelector<object, boolean> = createSelector(
  selectPaymentRequest,
  (s) => s.payment.loading
);

export const selectPaymentNetwork: MemoizedSelector<object, INetworkDetail | null> = createSelector(
  selectPaymentRequest,
  (s) => s.network
);

export const selectPaymentToken: MemoizedSelector<object, IToken | null> = createSelector(
  selectPaymentRequest,
  (s) => s.token
);

export const selectPaymentConversion: MemoizedSelector<object, DataConversionStore> = createSelector(
  selectPaymentRequest,
  (s) => ({ conversionToken: s.conversionToken, conversionUSD: s.conversionUSD })
);

// export const selectPaymentRequestInUsdIsEnabled: MemoizedSelector<object, boolean> = createSelector(
//   selectPaymentConversion,
//   (s) => s.data.priceInUsdEnabled
// );

export const selectIsNonNativeToken: MemoizedSelector<object, boolean> = createSelector(
  selectPaymentRequest,
  (s) => s.payment.data?.tokenId !== s.network?.nativeCurrency.id
);

export const selectSmartContractCanTransfer: MemoizedSelector<object, boolean> = createSelector(
  selectPaymentRequest,
  selectIsNonNativeToken,
  (s, isNonNative) => s.smartContractCanTransfer.data || !isNonNative
);

export const selectSmartContractCanTransferIsLoading: MemoizedSelector<object, boolean> = createSelector(
  selectPaymentRequest,
  (s) => s.smartContractCanTransfer.loading
);

export const selectSmartContractCanTransferError: MemoizedSelector<object, string | null> = createSelector(
  selectPaymentRequest,
  (s) => s.smartContractCanTransfer.error
);

export const selectPaymentNetworkIsMathing: MemoizedSelector<object, boolean> = createSelector(
  selectPaymentRequest,
  selectCurrentNetwork,
  (s, network) => s.network?.chainId === network?.chainId
);

export const selectProfilePayment: MemoizedSelector<object, IProfilePayment> = createSelector(
  selectPaymentRequest,
  (s) => s.profile
);

export const selectIsPaymentMaker: MemoizedSelector<object, boolean> = createSelector(
  selectPaymentRequest,
  selectPublicAddress,
  (s, adress) => adress?.toLowerCase() === s.profile?.publicAddress?.toLowerCase()
);

export interface DataConversionStore {
  conversionToken: StoreState<number | null>;
  conversionUSD: StoreState<number | null>;
}
