import { AuthState } from './auth-store/state/interfaces';
import { IGlobalState } from './global-store/state/interfaces';
import { IPaymentRequestState } from './payment-request-store/state/interfaces';
import { ITransactionsState } from './transaction-store/state/interfaces';

export interface RootState {
  auth: AuthState;
  global: IGlobalState;
  paymentRequest: IPaymentRequestState;
  transactions: ITransactionsState;
}
